# Editor System Documentation

## Overview
This editor system was implemented to provide flexibility in how text content is edited within the application. It allows for easy switching between different editor implementations while maintaining consistent behavior and content preservation.

## Architecture

### Core Components
1. `types.ts` - Contains core interfaces and types:
   - `Editor` - Base interface all editors must implement
   - `EditorType` - Union type of available editors
   - `EditorConfig` - Configuration interface for editor selection
   - `TipTapEditorInstance` - Interface for TipTap editor instance

2. `EditorWrapper.tsx` - Main component that handles editor selection and rendering
3. `TextAreaEditor.tsx` - Basic textarea implementation
4. `TipTapEditor.tsx` - Rich text editor implementation with formatting tools
5. `config.ts` - Editor configuration management

### Directory Structure
```
src/components/editors/
├── EditorWrapper.tsx
├── TextAreaEditor.tsx
├── TipTapEditor.tsx
├── TipTapEditor.css
├── types.ts
├── config.ts
├── index.ts
└── README.md
```

## Usage

### Basic Usage
```tsx
import { EditorWrapper, defaultEditorConfig } from './editors';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <EditorWrapper
      value={value}
      onChange={setValue}
      placeholder="Enter text..."
      disabled={false}
      aria-invalid={false}
      aria-describedby="error-message"
      className="custom-class"
      config={defaultEditorConfig}
    />
  );
}
```

### Editor Configurations
Both editors come with pre-configured options:

```tsx
import { EditorWrapper, defaultEditorConfig, tiptapEditorConfig } from './editors';

// Use textarea editor with default config
const textareaConfig = {
  type: 'textarea',
  options: {
    rows: 4,
    placeholder: 'Skriv innhold her...',
  }
};

// Use TipTap editor with rich text features
const tiptapConfig = {
  type: 'tiptap',
  options: {
    placeholder: 'Skriv innhold her...',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[100px]',
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
```

### Features
- Content preservation when switching between editors
- Accessibility support with ARIA attributes
- Form validation integration
- Disabled state handling
- Rich text formatting with TipTap editor
- Consistent behavior across editor types

## Adding New Editors

1. Create a new editor component implementing the `Editor` interface
2. Add the new editor type to `EditorType` in `types.ts`
3. Add the editor to the switch statement in `EditorWrapper.tsx`
4. Create a configuration object in `config.ts`

Example:
```tsx
// 1. Create editor component
function MyNewEditor({ 
  value, 
  onChange, 
  placeholder,
  disabled,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  className
}: Editor) {
  return (
    <div 
      className={className}
      data-testid="my-new-editor"
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
    >
      {/* Implementation */}
    </div>
  );
}

// 2. Add to EditorType
type EditorType = 'textarea' | 'tiptap' | 'my-new-editor';

// 3. Add to EditorWrapper
switch (config.type) {
  case 'my-new-editor':
    return <MyNewEditor {...editorProps} />;
  // ...
}

// 4. Add configuration
export const myNewEditorConfig: EditorConfig = {
  type: 'my-new-editor',
  options: {
    placeholder: 'Enter text...',
    // Add editor-specific options
  }
};
```

## Future Improvements
- Add markdown editor support
- Add collaborative editing features
- Implement undo/redo history
- Add file upload capabilities
- Add custom toolbar configurations
- Add theming support
