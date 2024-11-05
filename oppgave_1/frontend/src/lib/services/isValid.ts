// 📁frontend/src/lib/services/isValid.ts

type ValidatableValue = string | number | boolean | null | undefined | object | Array<any>;

// Funksjonen sjekker om alle felter i objektet eller arrayen er gyldige (ikke tomme, null eller undefined)
export const isValid = (items: ValidatableValue): boolean => {
  const invalidFields: string[] = [];

  const validate = (items: ValidatableValue, parentKey: string = ''): void => {
    // Handle null/undefined
    if (items === null || items === undefined) {
      invalidFields.push(parentKey);
      return;
    }

    // Handle empty strings
    if (typeof items === 'string' && items.trim() === '') {
      invalidFields.push(parentKey);
      return;
    }

    // Handle arrays
    if (Array.isArray(items)) {
      if (items.length === 0) {
        invalidFields.push(parentKey);
        return;
      }
      items.forEach((item, index) => validate(item, `${parentKey}[${index}]`));
      return;
    }

    // Handle objects
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
