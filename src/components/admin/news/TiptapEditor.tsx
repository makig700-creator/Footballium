"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Heading2 } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-[300px] w-full rounded-sm border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ccff00] disabled:cursor-not-allowed disabled:opacity-50 prose prose-invert max-w-none prose-p:my-2 prose-headings:my-4 prose-ul:my-2 prose-ol:my-2',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleClasses = (isActive: boolean) => 
    `p-2 rounded-sm transition-colors ${isActive ? 'bg-[#222] text-[#ccff00]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#111] border border-gray-800 rounded-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toggleClasses(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toggleClasses(editor.isActive('bold'))}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toggleClasses(editor.isActive('italic'))}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleClasses(editor.isActive('bulletList'))}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleClasses(editor.isActive('orderedList'))}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toggleClasses(editor.isActive('blockquote'))}
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
