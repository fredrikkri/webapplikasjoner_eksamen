import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from 'react';
import type { TipTapEditorInstance } from './src/components/editors/types';

// Create mock editor instance for state tracking
const mockEditor: TipTapEditorInstance = {
  getHTML: () => mockEditor.content || '',
  commands: {
    setContent: (content: string) => {
      mockEditor.content = content;
    },
    toggleBold: () => ({}),
    toggleItalic: () => ({}),
    toggleStrike: () => ({}),
    toggleHighlight: () => ({}),
    setTextAlign: (align: 'left' | 'center' | 'right') => ({}),
    toggleHeading: (options: { level: 1 | 2 }) => ({}),
    toggleBulletList: () => ({}),
    toggleOrderedList: () => ({}),
    setImage: (options: { src: string }) => ({}),
    toggleLink: (options: { href: string }) => ({})
  },
  setEditable: (editable: boolean) => {
    mockEditor.disabled = !editable;
  },
  isFocused: false,
  isActive: (name: string, options?: any) => false,
  content: '',
  disabled: false
};

// Mock TipTap editor
vi.mock('@tiptap/react', () => ({
  useEditor: () => mockEditor,
  EditorContent: (props: { editor: TipTapEditorInstance; className?: string }) => {
    const isDisabled = props.editor?.disabled || false;
    
    return React.createElement('div', {
      className: `ProseMirror ${props.className || ''}`,
      contentEditable: String(!isDisabled),
      'data-testid': 'tiptap-editor-content',
      'aria-label': 'Rich-Text Editor',
      children: props.editor?.content || ''
    });
  },
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

// Mock StarterKit
vi.mock('@tiptap/starter-kit', () => ({
  default: () => ({
    configure: () => ({}),
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Reset mock editor state
  mockEditor.content = '';
  mockEditor.disabled = false;
  mockEditor.isFocused = false;
});
