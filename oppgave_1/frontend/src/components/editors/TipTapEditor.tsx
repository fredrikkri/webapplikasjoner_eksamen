import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor as EditorInterface } from './types';

/**
 * TipTap implementation of the Editor interface
 * Uses the basic starter kit for essential formatting features
 */
export function TipTapEditor({ value, onChange, placeholder }: EditorInterface) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[100px] px-4 py-2.5',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-lg border border-slate-200 focus-within:border-emerald-600 transition-colors">
      <EditorContent editor={editor} />
      {!value && !editor?.isFocused && (
        <div className="absolute top-[1.25rem] left-4 text-slate-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
