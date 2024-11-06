/**
 * Interface for editor implementations
 * This allows us to easily swap between different editor implementations
 * while maintaining consistent behavior
 */
export interface Editor {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Configuration for editor selection
 * Add new editor types here when implementing new editors
 */
export type EditorType = 'textarea' | 'tiptap';

/**
 * Editor configuration object
 * Used to control which editor is currently active
 */
export interface EditorConfig {
  type: EditorType;
  options?: Record<string, unknown>;
}
