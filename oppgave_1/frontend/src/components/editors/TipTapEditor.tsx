import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Editor as EditorInterface } from './types';
import './TipTapEditor.css';

const MenuBar = ({ editor, disabled }: { editor: any; disabled?: boolean }) => {
  if (!editor || disabled) {
    return null;
  }

  const preventDefault = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
  };

  return (
    <div className="menu-bar">
            <div className="menu-group">
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleBold().run())}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
          disabled={disabled}
        >
          <span className="material-icons">format_bold</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleItalic().run())}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
          disabled={disabled}
        >
          <span className="material-icons">format_italic</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleStrike().run())}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
          disabled={disabled}
        >
          <span className="material-icons">format_strikethrough</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleHighlight().run())}
          className={editor.isActive('highlight') ? 'is-active' : ''}
          title="Highlight"
          disabled={disabled}
        >
          <span className="material-icons">highlight</span>
        </button>
      </div>

      <div className="menu-group">
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().setTextAlign('left').run())}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align Left"
          disabled={disabled}
        >
          <span className="material-icons">format_align_left</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().setTextAlign('center').run())}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align Center"
          disabled={disabled}
        >
          <span className="material-icons">format_align_center</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().setTextAlign('right').run())}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align Right"
          disabled={disabled}
        >
          <span className="material-icons">format_align_right</span>
        </button>
      </div>

      <div className="menu-group">
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
          disabled={disabled}
        >
          H1
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
          disabled={disabled}
        >
          H2
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleBulletList().run())}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
          disabled={disabled}
        >
          <span className="material-icons">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => editor.chain().focus().toggleOrderedList().run())}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
          disabled={disabled}
        >
          <span className="material-icons">format_list_numbered</span>
        </button>
      </div>

      <div className="menu-group">
        <button
          type="button"
          onClick={preventDefault(() => {
            const url = window.prompt('Enter the URL of the image:');
            if (url) {
              editor.chain().focus().setImage({ 
                src: url,
                alt: 'Image',
              }).run();
            }
          })}
          title="Insert Image"
          disabled={disabled}
        >
          <span className="material-icons">image</span>
        </button>
        <button
          type="button"
          onClick={preventDefault(() => {
            const url = window.prompt('Enter the URL');
            if (url) {
              editor.chain().focus().toggleLink({ href: url }).run();
            }
          })}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Insert Link"
          disabled={disabled}
        >
          <span className="material-icons">link</span>
        </button>
      </div>
    </div>
  );
};

export function TipTapEditor({ 
  value = '', 
  onChange, 
  placeholder, 
  disabled = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  className 
}: EditorInterface) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    editable: !disabled,
    onCreate: ({ editor }) => {
      // Set initial disabled state
      if (disabled) {
        editor.setEditable(false);
        const element = editor.view.dom as HTMLElement;
        element.setAttribute('contenteditable', 'false');
      }
    },
    onUpdate: ({ editor }) => {
      if (!disabled) {
        const content = editor.getHTML();
        const normalizedContent = content === '<p></p>' ? '' : content;
        onChange(normalizedContent);
      }
    }
  });

  // Update content when value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Force update contenteditable attribute on first render
  useLayoutEffect(() => {
    if (isFirstRender.current && editor) {
      isFirstRender.current = false;
      const element = editor.view.dom as HTMLElement;
      if (element) {
        element.setAttribute('contenteditable', (!disabled).toString());
      }
    }
  }, [editor, disabled]);

  // Update disabled state
  const updateEditable = useCallback(() => {
    if (editor) {
      editor.setEditable(!disabled);
      
      // Force update contenteditable attribute
      const element = editor.view.dom as HTMLElement;
      if (element) {
        element.setAttribute('contenteditable', (!disabled).toString());
        // Also set aria-disabled for accessibility
        element.setAttribute('aria-disabled', disabled.toString());
      }

      // Update disabled class on wrapper
      if (editorRef.current) {
        if (disabled) {
          editorRef.current.classList.add('disabled');
          editorRef.current.setAttribute('aria-disabled', 'true');
        } else {
          editorRef.current.classList.remove('disabled');
          editorRef.current.setAttribute('aria-disabled', 'false');
        }
      }
    }
  }, [editor, disabled]);

  // Ensure disabled state is applied immediately and after any changes
  useEffect(() => {
    updateEditable();
  }, [updateEditable]);

  // Additional effect to ensure contenteditable attribute is set correctly
  useEffect(() => {
    if (editor) {
      const element = editor.view.dom as HTMLElement;
      if (element) {
        element.setAttribute('contenteditable', (!disabled).toString());
        // Ensure pointer events are disabled
        if (disabled) {
          element.style.pointerEvents = 'none';
        } else {
          element.style.pointerEvents = '';
        }
      }
    }
  }, [editor, disabled]);

  return (
    <div 
      ref={editorRef}
      className={`editor-wrapper ${
        ariaInvalid === true || ariaInvalid === 'true'
          ? 'border-red-500' 
          : ''
      } ${
        disabled 
          ? 'cursor-not-allowed bg-slate-50' 
          : ''
      } ${className || ''}`}
      data-testid="tiptap-editor"
      role="textbox"
      aria-multiline="true"
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled}
    >
      <MenuBar editor={editor} disabled={disabled} />
      <div ref={contentRef}>
        <EditorContent 
          editor={editor} 
          className={disabled ? 'pointer-events-none opacity-50' : ''}
        />
      </div>
      {(!value || value === '<p></p>') && !editor?.isFocused && (
        <div className="absolute top-[1.25rem] left-4 text-slate-400 pointer-events-none">
          {placeholder || 'Skriv innhold her...'}
        </div>
      )}
    </div>
  );
}
