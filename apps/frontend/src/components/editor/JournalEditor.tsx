import React, { useState } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'

import SlashCommand from './SlashCommandExtension'
import SlashMenu from './SlashMenu'

const JournalEditor = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuCoords, setMenuCoords] = useState<{ left: number, top: number } | null>(null);


  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({
        placeholder: 'Write your journal here...',
      }),
      SlashCommand.configure({
        onSlash: (coords: { left: number, top: number }) => {
          setMenuCoords(coords);
          setShowMenu(true);
        },
      }),
    ],
    content: '',
  })

  return (
    <div className="editor-container" style={{ position: 'relative' }}>
      <EditorContent editor={editor} />
      {showMenu && menuCoords && (
        <SlashMenu
          editor={editor}
          coords={menuCoords}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

export default JournalEditor
