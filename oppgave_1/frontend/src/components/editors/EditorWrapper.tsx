import { Editor, EditorConfig } from './types';
import { TextAreaEditor } from './TextAreaEditor';
import { TipTapEditor } from './TipTapEditor';


export function EditorWrapper(props: Editor & { config: EditorConfig }) {
  const { config, ...editorProps } = props;

  switch (config.type) {
    case 'textarea':
      return <TextAreaEditor {...editorProps} />;
    case 'tiptap':
      return <TipTapEditor {...editorProps} />;
    default:
      return <TextAreaEditor {...editorProps} />;
  }
}
