export const roundWithPrecision = (num: any, precision = 2) => {
  const multiplier = Math.pow(10, precision);
  return Math.round(num * multiplier) / multiplier;
};

export const toTitleCase = (str: string, splitAt = ' ', joinAt = ' ') => {
  return str.split(splitAt)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join(joinAt);
};