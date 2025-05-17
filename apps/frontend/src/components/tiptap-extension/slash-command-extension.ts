import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { SlashCommandList } from './slash-command-list'
import { Editor } from '@tiptap/core'
import { Node as ProsemirrorNode } from 'prosemirror-model'

export interface SlashCommandItem {
    title: string
    description: string
    icon?: React.ComponentType<{ className?: string }>
    command: (editor: Editor) => void
}

export interface SlashCommandOptions {
    commands: SlashCommandItem[]
    suggestion: {
        char: string
        startOfLine: boolean
        command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: { command: (editor: Editor) => void; parentNode: ProsemirrorNode; parentPos: number } }) => void
    }
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
    name: 'slashCommand',

    addOptions() {
        return {
            commands: [],
            suggestion: {
                char: '/',
                startOfLine: false,
                command: ({ editor, range, props }) => {
                    // Delete the slash character
                    editor.chain().focus().deleteRange(range).run();

                    // Apply the command
                    if (props.command && typeof props.command === 'function') {
                        try {
                            // Ensure focus is on the editor before executing command
                            editor.chain().focus();

                            // Execute the command
                            props.command(editor);
                        } catch (error) {
                            console.error('Error executing command:', error);
                        }
                    }
                },
            },
        }
    },

    addProseMirrorPlugins() {
        let component: ReactRenderer | null = null
        let popup: TippyInstance | null = null

        const destroy = () => {
            // Clean up component
            if (component) {
                try {
                    component.destroy()
                } catch (error) {
                    console.error('Error destroying component:', error)
                }
                component = null
            }

            // Clean up popup
            if (popup) {
                try {
                    popup.hide()
                    popup.destroy()
                } catch (error) {
                    console.error('Error destroying popup:', error)
                }
                popup = null
            }
        }

        return [
            new Plugin({
                key: new PluginKey('slashCommand'),
                view: () => ({
                    update: (view, prevState) => {
                        const { state } = view
                        const { selection } = state
                        const { empty } = selection
                        const from = selection.from

                        // Only destroy if something significant changed
                        if (prevState &&
                            prevState.selection.from !== state.selection.from &&
                            component !== null &&
                            popup !== null) {
                            destroy()
                        }

                        if (!empty) {
                            destroy()
                            return
                        }

                        // Check if the character at current position is '/'
                        const $pos = state.doc.resolve(from)
                        const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)
                        const lastChar = textBefore.slice(-1)

                        const isSlash = lastChar === '/'

                        // If we already have a popup showing, don't create a new one
                        if (isSlash && popup) {
                            return
                        }

                        if (!isSlash) {
                            destroy()
                            return
                        }

                        const start = from - 1
                        const end = from

                        try {
                            // Instead of trying to create a complex widget, let's create a simple marker
                            // decoration and handle the popup separately
                            const decoration = DecorationSet.create(state.doc, [
                                Decoration.inline(start, end, {
                                    class: 'slash-command-marker',
                                })
                            ])

                            try {
                                // Store the parent node where slash was typed
                                const parentNode = $pos.parent
                                const parentPos = $pos.start()

                                // Create the component
                                component = new ReactRenderer(SlashCommandList, {
                                    props: {
                                        items: this.options.commands,
                                        command: (item: SlashCommandItem) => {
                                            // Hide and destroy the popup before executing the command
                                            if (popup) {
                                                try {
                                                    popup.hide();
                                                    popup.destroy();
                                                } catch (e) {
                                                    console.error('Error destroying popup:', e);
                                                }
                                                popup = null;
                                            }

                                            // Destroy the component
                                            if (component) {
                                                try {
                                                    component.destroy();
                                                } catch (e) {
                                                    console.error('Error destroying component:', e);
                                                }
                                                component = null;
                                            }

                                            // If no item was selected (e.g., escape key pressed), just clean up
                                            if (!item) {
                                                return
                                            }

                                            // Execute the command with the correct range
                                            // Use a timeout to ensure state is stable
                                            setTimeout(() => {
                                                this.options.suggestion.command({
                                                    editor: this.editor,
                                                    range: { from: start, to: end },
                                                    props: {
                                                        command: item.command,
                                                        parentNode,
                                                        parentPos
                                                    },
                                                });
                                            }, 10);
                                        },
                                    },
                                    editor: this.editor,
                                })

                                // Use directly the element from ReactRenderer
                                const { top, left } = view.coordsAtPos(from)

                                // Add a little offset to position the popup below the cursor
                                const rect = new DOMRect(left, top + 20, 0, 0)

                                popup = tippy(document.body, {
                                    getReferenceClientRect: () => rect,
                                    appendTo: document.body,
                                    content: component.element, // Use the element directly
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: 'manual',
                                    placement: 'bottom-start',
                                    offset: [0, 10],
                                    zIndex: 9999,
                                    theme: 'light',
                                    arrow: false,
                                    maxWidth: 'none',
                                })

                                // Apply custom styles to tippy container for better visibility
                                if (popup && popup.popper) {
                                    // Make sure the tippy container is fully visible
                                    popup.popper.style.cssText += ';visibility:visible !important;opacity:1 !important;';

                                    const tippyBox = popup.popper.querySelector('.tippy-box') as HTMLElement;
                                    if (tippyBox) {
                                        tippyBox.style.backgroundColor = 'transparent';
                                        tippyBox.style.border = 'none';
                                        tippyBox.style.boxShadow = 'none';
                                    }

                                    const tippyContent = popup.popper.querySelector('.tippy-content') as HTMLElement;
                                    if (tippyContent) {
                                        tippyContent.style.padding = '0';
                                        tippyContent.style.margin = '0';
                                    }
                                }

                                popup.show()
                            } catch (error) {
                                console.error('Error creating popup:', error)
                            }

                            return decoration
                        } catch (error) {
                            console.error('Error creating decoration:', error)
                            return DecorationSet.empty
                        }
                    },
                    destroy,
                }),
            }),
        ]
    },
}) 