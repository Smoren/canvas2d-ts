export const checkEmptyValue = <T>(obj: T): T => {
  let copy = JSON.parse(JSON.stringify(obj));

  Object.keys(copy as typeof Object).forEach((item) => {
    const key = item as keyof typeof copy;

    if (Array.isArray(copy[key]) || copy[key] === null) {
      return;
    }

    if (typeof copy[key] === 'string' && copy[key] === '') {
      delete copy[key];
    }

    if (copy[key] instanceof Object) {
      copy[key] = checkEmptyValue(copy[key]);
    }
  });

  return copy;
};
