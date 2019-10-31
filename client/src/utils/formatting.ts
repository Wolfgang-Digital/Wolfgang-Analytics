export const toUpperCase = (str: string) => str.toUpperCase().split(' ').join('_');

export const toTitleCase = (str: string, split = '_', join = ' ') => {
  return str.split(split)
    .map(n => n.charAt(0).toUpperCase() + n.substr(1).toLowerCase())
    .join(join);
};