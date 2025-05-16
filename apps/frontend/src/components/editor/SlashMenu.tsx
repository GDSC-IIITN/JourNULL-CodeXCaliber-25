import React from 'react'

const SlashMenu = ({
  editor,
  coords,
  onClose,
}: {
  editor: any,
  coords: { left: number, top: number },
  onClose: () => void,
}) => {
  const commands = [
    { label: 'Heading 1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Insert Image', command: () => {
      const url = window.prompt('Image URL');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: coords.top + 20, 
        left: coords.left,
        background: 'white',
        border: '1px solid black',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        padding: '8px',
        zIndex: 100,
      }}
    >
      {commands.map((cmd, index) => (
        <div
          key={index}
          style={{ cursor: 'pointer', padding: '4px 8px' }}
          onClick={() => {
            cmd.command();
            onClose();
          }}
        >
          {cmd.label}
        </div>
      ))}
      <div
        style={{ color: 'gray', fontSize: '12px', marginTop: '4px', cursor: 'pointer' }}
        onClick={onClose}
      >
        Close
      </div>
    </div>
  )
}

export default SlashMenu

