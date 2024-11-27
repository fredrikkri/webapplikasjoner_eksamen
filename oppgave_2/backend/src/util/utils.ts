export const createId = () => {
    return crypto.randomUUID();
};

export const parseDate = (data: any) => {
    if (typeof data.date === 'string') {
      return { ...data, date: new Date(data.date).toISOString()};
    }
    return data;
  };