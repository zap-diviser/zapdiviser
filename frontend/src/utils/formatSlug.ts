export const formatSlug = (value: string) => {
  // return value
  //   .toLowerCase()
  //   .replace(/[^\w ]+/g, '')
  //   .replace(/ +/g, '-');

  //remain all olds -
  return value
    .toLowerCase()
    .replace(/[^\w- ]+/g, '')
    .replace(/ +/g, '-');
};
