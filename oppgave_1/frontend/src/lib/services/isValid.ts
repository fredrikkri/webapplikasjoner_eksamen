type ValidatableValue = string | number | boolean | null | undefined | object | Array<any>;

export const isValid = (items: ValidatableValue): boolean => {
  const invalidFields: string[] = [];

  const validate = (items: ValidatableValue, parentKey: string = ''): void => {
    if (items === null || items === undefined) {
      invalidFields.push(parentKey);
      return;
    }

    if (typeof items === 'string' && items.trim() === '') {
      invalidFields.push(parentKey);
      return;
    }

    if (Array.isArray(items)) {
      if (items.length === 0) {
        invalidFields.push(parentKey);
        return;
      }
      items.forEach((item, index) => validate(item, `${parentKey}[${index}]`));
      return;
    }

    if (typeof items === 'object') {
      Object.entries(items).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)
        ) {
          invalidFields.push(fullKey);
        } else {
          validate(value, fullKey);
        }
      });
    }
  };

  validate(items);
  return invalidFields.length === 0;
};
