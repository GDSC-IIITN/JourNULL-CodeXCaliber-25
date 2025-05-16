import { Extension } from '@tiptap/core'

const SlashCommandExtension = Extension.create({
  name: 'slashCommand',
  
  addOptions() {
    return {
      onSlash: (coords: { left: number, top: number }) => {},
    }
  },

  addKeyboardShortcuts() {
    return {
      'Slash': () => {
        const { from } = this.editor.state.selection;
        const coords = this.editor.view.coordsAtPos(from);
        this.options.onSlash(coords);
        return true
      },
    }
  },
})

export default SlashCommandExtension;
