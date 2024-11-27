export interface Editor {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
  className?: string;
}

export type EditorType = 'textarea' | 'tiptap';

export interface EditorConfig {
  type: EditorType;
  options?: {
    rows?: number;
    placeholder?: string;
    editorProps?: {
      attributes?: {
        class?: string;
        'data-testid'?: string;
      };
    };
    extensions?: Array<
      | 'starterKit'
      | 'highlight'
      | 'typography'
      | 'textAlign'
      | 'link'
      | 'image'
    >;
  };
}

export interface TipTapEditorInstance {
  getHTML: () => string;
  commands: {
    setContent: (content: string, emitUpdate?: boolean) => void;
    toggleBold: () => any;
    toggleItalic: () => any;
    toggleStrike: () => any;
    toggleHighlight: () => any;
    setTextAlign: (align: 'left' | 'center' | 'right') => any;
    toggleHeading: (options: { level: 1 | 2 }) => any;
    toggleBulletList: () => any;
    toggleOrderedList: () => any;
    setImage: (options: { src: string }) => any;
    toggleLink: (options: { href: string }) => any;
  };
  setEditable: (editable: boolean) => void;
  isFocused: boolean;
  isActive: (name: string, options?: any) => boolean;
  content?: string;
  disabled?: boolean;
}
