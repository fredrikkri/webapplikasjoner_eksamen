export interface Editor {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export type EditorType = 'textarea' | 'tiptap';

export interface EditorConfig {
  type: EditorType;
  options?: Record<string, unknown>;
}
