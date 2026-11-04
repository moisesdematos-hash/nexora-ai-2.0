'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'
import { useEffect } from 'react'

interface EbookEditorProps {
  content: string
  onChange: (content: string) => void
  disabled?: boolean
}

export function EbookEditor({ content, onChange, disabled }: EbookEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none text-foreground leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(
        content
          .split('\n\n')
          .map((p) => `<p>${p}</p>`)
          .join('')
      )
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bold')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('italic')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-5 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Título 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-5 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Lista"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          }`}
          title="Citação"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-5 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30"
          title="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30"
          title="Refazer"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Canvas */}
      <EditorContent editor={editor} />
    </div>
  )
}
