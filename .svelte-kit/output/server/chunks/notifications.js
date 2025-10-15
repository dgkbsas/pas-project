import { a as toast } from "./toast-state.svelte.js";
function showToast(options) {
  const { type, message, description, duration } = options;
  const config = {
    description,
    duration: duration || 3e3
  };
  switch (type) {
    case "success":
      return toast.success(message, config);
    case "error":
      return toast.error(message, config);
    case "warning":
      return toast.warning(message, config);
    case "info":
      return toast.message(message, config);
    case "loading":
      return toast.loading(message, config);
    default:
      return toast.message(message, config);
  }
}
({
  promise: toast.promise,
  custom: toast.custom,
  dismiss: toast.dismiss
});
export {
  showToast as s
};
