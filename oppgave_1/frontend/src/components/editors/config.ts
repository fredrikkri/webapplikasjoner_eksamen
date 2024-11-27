import { EditorConfig } from './types';

export const defaultEditorConfig: EditorConfig = {
  type: 'textarea',
  options: {
    rows: 4,
    placeholder: 'Skriv innhold her...',
  }
};

export const tiptapEditorConfig: EditorConfig = {
  type: 'tiptap',
  options: {
    placeholder: 'Skriv innhold her...',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[100px] px-4 py-2.5',
        'data-testid': 'tiptap-editor-content',
      },
    },
    extensions: [
      'starterKit',
      'highlight',
      'typography',
      'textAlign',
      'link',
      'image'
    ],
  }
};
