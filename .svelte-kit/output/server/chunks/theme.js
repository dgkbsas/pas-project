import { w as writable } from "./index.js";
function getInitialTheme() {
  return "system";
}
const theme = writable(getInitialTheme());
export {
  theme as t
};
