export const cleanQuery = (query: Record<string, any>) => {
  const cleaned: Record<string, any> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};
