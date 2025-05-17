"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { createRoot } from "react-dom/client"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { Video } from "@/components/tiptap-extension/video-extension"
import { Placeholder } from "@tiptap/extension-placeholder"

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"
import { SlashCommand } from "@/components/tiptap-extension/slash-command-extension"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-extension/slash-command.scss"
import "tippy.js/dist/tippy.css"

// --- Icons ---
import { Heading1Icon } from "@/components/tiptap-icons/heading1-icon"
import { Heading2Icon } from "@/components/tiptap-icons/heading2-icon"
import { Heading3Icon } from "@/components/tiptap-icons/heading3-icon"
import { ListIcon } from "@/components/tiptap-icons/list-icon"
import { ListOrderedIcon } from "@/components/tiptap-icons/list-ordered-icon"
import { ListTodoIcon } from "@/components/tiptap-icons/list-todo-icon"
import { QuoteIcon } from "@/components/tiptap-icons/quote-icon"
import { CodeIcon } from "@/components/tiptap-icons/code-icon"
import { ImageIcon } from "@/components/tiptap-icons/image-icon"
import { VideoIcon } from "@/components/tiptap-icons/video-icon"

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import VideoRecorderModal from "@/components/video-recorder"

// --- Lib ---
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

export function SimpleEditor({ content, setContent }: { content?: string, setContent?: (content: string) => void } = {}) {
  const isMobile = useMobile()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
      Video.configure({
        HTMLAttributes: {
          class: 'video-node',
        },
      }),
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: async (file) => {
          try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error);

            const { fileKey } = uploadData;

            const readRes = await fetch(`/api/read-url?key=${encodeURIComponent(fileKey)}`);
            const readData = await readRes.json();

            if (!readRes.ok) throw new Error(readData.error);
            return readData.signedUrl;
          } catch (err) {
            console.error("Upload failed:", err);
            throw err;
          }
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
      ...(isMobile ? [] : [
        SlashCommand.configure({
          commands: [
            {
              title: 'Text',
              description: 'Just start typing with plain text',
              command: (editor) => {
                editor.chain().focus().toggleNode('paragraph', 'paragraph').run()
              },
            },
            {
              title: 'Heading 1',
              description: 'Big section heading',
              icon: Heading1Icon,
              command: (editor) => {
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              },
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              icon: Heading2Icon,
              command: (editor) => {
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              },
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              icon: Heading3Icon,
              command: (editor) => {
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              },
            },
            {
              title: 'Bullet List',
              description: 'Create a simple bullet list',
              icon: ListIcon,
              command: (editor) => {
                editor.chain().focus().toggleBulletList().run()
              },
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              icon: ListOrderedIcon,
              command: (editor) => {
                editor.chain().focus().toggleOrderedList().run()
              },
            },
            {
              title: 'Task List',
              description: 'Create a task list',
              icon: ListTodoIcon,
              command: (editor) => {
                editor.chain().focus().toggleTaskList().run()
              },
            },
            {
              title: 'Quote',
              description: 'Capture a quote',
              icon: QuoteIcon,
              command: (editor) => {
                editor.chain().focus().toggleBlockquote().run()
              },
            },
            {
              title: 'Code',
              description: 'Capture a code snippet',
              icon: CodeIcon,
              command: (editor) => {
                editor.chain().focus().toggleCodeBlock().run()
              },
            },
            {
              title: 'Image',
              description: 'Upload an image',
              icon: ImageIcon,
              command: (editor) => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = async () => {
                  if (input.files?.length) {
                    const file = input.files[0]
                    try {
                      const formData = new FormData();
                      formData.append("file", file);

                      const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const uploadData = await uploadRes.json();
                      if (!uploadRes.ok) throw new Error(uploadData.error);

                      const { fileKey } = uploadData;

                      const readRes = await fetch(`/api/read-url?key=${encodeURIComponent(fileKey)}`);
                      const readData = await readRes.json();

                      if (!readRes.ok) throw new Error(readData.error);

                      // Use Image extension's setImage command
                      editor.chain().focus().setImage({ src: readData.signedUrl }).run()
                    } catch (error) {
                      console.error('Error uploading image:', error)
                    }
                  }
                }
                input.click()
              },
            },
            {
              title: 'Video',
              description: 'Record a video',
              icon: VideoIcon,
              command: (editor) => {
                try {
                  // Create a container for the video recorder
                  const recorderContainer = document.createElement('div');
                  recorderContainer.style.position = 'fixed';
                  recorderContainer.style.top = '0';
                  recorderContainer.style.left = '0';
                  recorderContainer.style.width = '100%';
                  recorderContainer.style.height = '100%';
                  recorderContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  recorderContainer.style.zIndex = '9999';
                  recorderContainer.style.display = 'flex';
                  recorderContainer.style.flexDirection = 'column';
                  recorderContainer.style.alignItems = 'center';
                  recorderContainer.style.justifyContent = 'center';
                  recorderContainer.style.padding = '20px';

                  // Create close button
                  const closeBtn = document.createElement('button');
                  closeBtn.textContent = 'Close';
                  closeBtn.style.position = 'absolute';
                  closeBtn.style.top = '20px';
                  closeBtn.style.right = '20px';
                  closeBtn.style.padding = '8px 16px';
                  closeBtn.style.backgroundColor = '#6b7280';
                  closeBtn.style.color = 'white';
                  closeBtn.style.border = 'none';
                  closeBtn.style.borderRadius = '4px';
                  closeBtn.style.cursor = 'pointer';
                  closeBtn.style.zIndex = '10000';

                  // Mount the React component to the container
                  const root = document.createElement('div');
                  root.style.width = '100%';
                  root.style.maxWidth = '700px';
                  recorderContainer.appendChild(root);
                  recorderContainer.appendChild(closeBtn);
                  document.body.appendChild(recorderContainer);

                  // Create React root
                  const reactRoot = createRoot(root);

                  // Define cleanup function first
                  const cleanup = () => {
                    if (recorderContainer && recorderContainer.parentNode) {
                      // Unmount React component
                      if (reactRoot) {
                        reactRoot.unmount();
                      }
                      // Remove container
                      recorderContainer.parentNode.removeChild(recorderContainer);
                      // Focus back on editor
                      editor.chain().focus().run();
                    }
                  };

                  // Handle upload completion
                  const handleUploadComplete = (viewUrl: string) => {
                    if (viewUrl) {
                      // Insert the video into the editor
                      editor.chain().focus().setVideo(viewUrl).run();

                      // Clean up the container after successful upload
                      setTimeout(() => {
                        cleanup();
                      }, 2000);
                    }
                  };

                  // Close button event listener
                  closeBtn.addEventListener('click', cleanup);

                  // Render the component
                  reactRoot.render(
                    React.createElement(VideoRecorderModal, {
                      onUploadComplete: handleUploadComplete,
                      onClose: cleanup
                    })
                  );

                } catch (error) {
                  console.error('Error setting up video recorder:', error);
                  alert('An error occurred while setting up the video recorder.');
                }
              },
            },
          ],
        }),
      ]),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
  })

  useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="content-wrapper">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>
    </EditorContext.Provider>
  )
}
