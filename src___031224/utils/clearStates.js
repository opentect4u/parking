/**
 * The function `clearStates` takes an array of functions and a value, and calls each function with the
 * given value as an argument.
 * @param {Function[]} funcs - `funcs` is an array of functions.
 * @param {number | string | [] | boolean | (() => number) | (() => string) | (() => []) | (() =>
 * boolean)} val - The `val` parameter can be a number, string, array, boolean, or a function that
 * returns a number, string, array or boolean.
 */
export const clearStates = (funcs, val) => {
  funcs.map(item => item(val));
};
