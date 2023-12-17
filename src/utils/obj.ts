export const freezeObj = (obj: any) => {
  return Object.seal(Object.freeze(obj));
};
