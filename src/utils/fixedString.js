export const fixedString = (string, no) => {
  if (string?.length < no) {
    for (let i = 0; i < no - 1; i++) {
      string += " ";
    }
    return string;
  } else {
    return string?.slice(0, no);
  }
};
