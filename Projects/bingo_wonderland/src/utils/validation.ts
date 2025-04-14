export const validateItems = (items: string[]): {
  isValid: boolean;
  uniqueItems: string[];
  errors: string[];
} => {
  const errors: string[] = [];
  const seen = new Set<string>();
  const uniqueItems = [];

  // Filter out empty items and trim whitespace
  const cleanedItems = items
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Check maximum items limit
  if (cleanedItems.length > 40) {
    errors.push('Maximum 40 items allowed');
  }

  // Check for duplicates and build unique list
  for (const item of cleanedItems) {
    if (seen.has(item)) {
      errors.push(`Duplicate item found: ${item}`);
    } else {
      seen.add(item);
      uniqueItems.push(item);
    }
  }

  return {
    isValid: errors.length === 0,
    uniqueItems,
    errors
  };
};