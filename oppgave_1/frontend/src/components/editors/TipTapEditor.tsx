import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor as EditorInterface } from './types';

function processEditorContent(html: string): string {
  const trimmed = html.trim();
  
  const singleParagraphMatch = trimmed.match(/^<p>(.*?)<\/p>$/s);
  if (singleParagraphMatch) {
    const innerContent = singleParagraphMatch[1];
    if (!/<[^>]*>/g.test(innerContent)) {
      return innerContent;
    }
  }
  
  return trimmed;
}

export function TipTapEditor({ value, onChange, placeholder, disabled = false }: EditorInterface) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[100px] px-4 py-2.5',
      },
    },
    onUpdate: ({ editor }) => {
      if (!disabled) {
        const html = editor.getHTML();
        const processedContent = processEditorContent(html);
        onChange(processedContent);
      }
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  return (
    <div className={`rounded-lg border border-slate-200 transition-colors ${
      disabled 
        ? 'cursor-not-allowed bg-slate-50' 
        : 'focus-within:border-emerald-600'
    }`}>
      <EditorContent editor={editor} />
      {!value && !editor?.isFocused && (
        <div className="absolute top-[1.25rem] left-4 text-slate-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
