import { Editor, EditorConfig } from './types';
import { TextAreaEditor } from './TextAreaEditor';
import { TipTapEditor } from './TipTapEditor';
import { useEffect, useState } from 'react';

export function EditorWrapper({ config, value, onChange, disabled, ...rest }: Editor & { config: EditorConfig }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousConfig, setPreviousConfig] = useState(config);

  // Update internal value when external value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Handle editor type changes and preserve content
  useEffect(() => {
    if (previousConfig.type !== config.type) {
      let processedValue = currentValue;

      // When switching from TipTap to textarea, strip HTML tags and trim
      if (previousConfig.type === 'tiptap' && config.type === 'textarea') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentValue;
        processedValue = (tempDiv.textContent || tempDiv.innerText || '').trim();
      } 
      // When switching from textarea to TipTap, wrap in paragraph tags if needed
      else if (previousConfig.type === 'textarea' && config.type === 'tiptap') {
        if (!currentValue.startsWith('<')) {
          processedValue = `<p>${currentValue}</p>`;
        }
      }

      // Only update if the value has changed
      if (processedValue !== currentValue) {
        setCurrentValue(processedValue);
        onChange(processedValue);
      }

      setPreviousConfig(config);
    }
  }, [config.type, previousConfig.type, currentValue, onChange]);

  // Handle value changes and propagate to parent
  const handleChange = (newValue: string) => {
    // Only update if the value has changed
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  const sharedProps = {
    ...rest,
    value: currentValue,
    onChange: handleChange,
    disabled,
    'data-testid': `${config.type}-editor`,
  };

  switch (config.type) {
    case 'textarea':
      return <TextAreaEditor {...sharedProps} />;
    case 'tiptap':
      return <TipTapEditor {...sharedProps} />;
    default:
      return <TextAreaEditor {...sharedProps} />;
  }
}
