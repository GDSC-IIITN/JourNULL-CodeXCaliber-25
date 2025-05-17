import { Node, nodeInputRule } from '@tiptap/react'
import { Plugin, PluginKey } from 'prosemirror-state'

export interface VideoOptions {
    HTMLAttributes: Record<string, string | boolean | number>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        video: {
            /**
             * Set a video node
             */
            setVideo: (src: string) => ReturnType,
            /**
             * Toggle a video
             */
            toggleVideo: (src: string) => ReturnType,
        }
    }
}

const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export const Video = Node.create({
    name: 'video',

    group: "block",

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (el) => (el as HTMLSpanElement).getAttribute('src'),
                renderHTML: (attrs) => ({ src: attrs.src }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video',
                getAttrs: el => ({ src: (el as HTMLVideoElement).getAttribute('src') }),
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'video',
            {
                controls: 'true',
                style: 'width: 100%',
                draggable: 'true',
                ...HTMLAttributes
            },
            ['source', HTMLAttributes]
        ]
    },

    addCommands() {
        return {
            setVideo: (src: string) => ({ commands }) => commands.insertContent(`<video controls="true" style="width: 100%" draggable="true" src="${src}" />`),

            toggleVideo: () => ({ commands }) => commands.toggleNode(this.name, 'paragraph'),
        };
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: VIDEO_INPUT_REGEX,
                type: this.type,
                getAttributes: (match) => {
                    const [, , src] = match
                    return { src }
                },
            })
        ]
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('videoDropPlugin'),

                props: {
                    handleDOMEvents: {
                        dragstart: (view, event) => {
                            const { state } = view
                            const { selection } = state
                            const { empty } = selection

                            if (empty) return false

                            const node = state.doc.nodeAt(selection.from)
                            if (!node || node.type.name !== 'video') return false

                            event.dataTransfer?.setData('text/plain', '')
                            event.dataTransfer?.setData('application/json', JSON.stringify({
                                type: 'video',
                                src: node.attrs.src
                            }))

                            return true
                        },
                        drop: (view, event) => {
                            const { state: { schema, tr }, dispatch } = view
                            const hasFiles = event.dataTransfer &&
                                event.dataTransfer.files &&
                                event.dataTransfer.files.length

                            if (!hasFiles) {
                                try {
                                    const data = event.dataTransfer?.getData('application/json')
                                    if (!data) return false

                                    const { type, src } = JSON.parse(data)
                                    if (type !== 'video') return false

                                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                                    if (!coordinates) return false

                                    const node = schema.nodes.video.create({ src })
                                    const transaction = tr.insert(coordinates.pos, node)
                                    dispatch(transaction)

                                    return true
                                } catch (error) {
                                    console.error('Error handling video drop:', error)
                                    return false
                                }
                            }

                            const videos = Array
                                .from(event.dataTransfer.files)
                                .filter(file => (/video/i).test(file.type))

                            if (videos.length === 0) return false

                            event.preventDefault()

                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

                            videos.forEach(video => {
                                const reader = new FileReader()

                                reader.onload = readerEvent => {
                                    const node = schema.nodes.video.create({ src: readerEvent.target?.result })

                                    if (coordinates && typeof coordinates.pos === 'number') {
                                        const transaction = tr.insert(coordinates?.pos, node)
                                        dispatch(transaction)
                                    }
                                }

                                reader.readAsDataURL(video)
                            })

                            return true
                        }
                    }
                }
            })
        ]
    }
})