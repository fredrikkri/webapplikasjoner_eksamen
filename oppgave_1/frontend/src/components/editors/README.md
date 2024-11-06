# Editor System Documentation

## Overview
This editor system was implemented to provide flexibility in how text content is edited within the application. It allows for easy switching between different editor implementations while maintaining consistent behavior.

## Architecture

### Core Components
1. `types.ts` - Contains core interfaces and types:
   - `Editor` - Base interface all editors must implement
   - `EditorType` - Union type of available editors
   - `EditorConfig` - Configuration interface for editor selection

2. `EditorWrapper.tsx` - Main component that handles editor selection and rendering
3. `TextAreaEditor.tsx` - Basic textarea implementation
4. `config.ts` - Editor configuration management

### Directory Structure
```
src/components/editors/
├── EditorWrapper.tsx
├── TextAreaEditor.tsx
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
      config={defaultEditorConfig}
    />
  );
}
```

### Switching Editors
To switch between editors, modify the editor config:

```tsx
import { EditorWrapper, defaultEditorConfig, tiptapEditorConfig } from './editors';

// Use textarea editor
<EditorWrapper config={defaultEditorConfig} {...props} />

// Use TipTap editor (when implemented)
<EditorWrapper config={tiptapEditorConfig} {...props} />
```

## Adding New Editors

1. Create a new editor component implementing the `Editor` interface
2. Add the new editor type to `EditorType` in `types.ts`
3. Add the editor to the switch statement in `EditorWrapper.tsx`
4. Create a configuration object in `config.ts`

Example:
```tsx
// 1. Create editor component
function MyNewEditor({ value, onChange, placeholder }: Editor) {
  return (
    // Implementation
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
  options: {}
};
```

## Future Improvements
- Add editor-specific configuration options
- Implement state persistence for editor preferences
- Add more rich text editors
- Add preview mode
