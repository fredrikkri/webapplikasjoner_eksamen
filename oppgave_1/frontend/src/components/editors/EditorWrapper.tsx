import { Editor, EditorConfig } from './types';
import { TextAreaEditor } from './TextAreaEditor';
import { TipTapEditor } from './TipTapEditor';

/**
 * EditorWrapper component
 * This component handles the logic for switching between different editor implementations
 * based on the provided configuration
 */
export function EditorWrapper(props: Editor & { config: EditorConfig }) {
  const { config, ...editorProps } = props;

  // Switch between different editor implementations based on config
  switch (config.type) {
    case 'textarea':
      return <TextAreaEditor {...editorProps} />;
    case 'tiptap':
      return <TipTapEditor {...editorProps} />;
    default:
      return <TextAreaEditor {...editorProps} />;
  }
}
