export const isFormDataEmpty = (formData: FormData): boolean => {
  // @ts-ignore
  const iterator = formData.entries();
  return iterator.next().done === true;
}
