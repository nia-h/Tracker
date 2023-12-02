//refactor:
// setState and reRender first and THEN make Axios calls
import times from "lodash/fp/times.js";
// const { times } = require("lodash/fp");

let a = times(() => {
  return "Hello";
}, 2);
console.log("a==>", a);
