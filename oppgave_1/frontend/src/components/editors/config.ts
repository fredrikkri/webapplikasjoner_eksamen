import { EditorConfig } from './types';

/**
 * Default editor configuration
 * This can be modified to change the active editor type
 * In the future, this could be loaded from environment variables,
 * user preferences, or other configuration sources
 */
export const defaultEditorConfig: EditorConfig = {
  type: 'textarea',
  options: {}
};

/**
 * Editor configuration for TipTap
 * Currently a placeholder - will be implemented when TipTap is added
 */
export const tiptapEditorConfig: EditorConfig = {
  type: 'tiptap',
  options: {}
};
