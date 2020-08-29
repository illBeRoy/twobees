export const callAndIgnoreError = (fn: () => void) => {
  try {
    fn();
  } catch (err) {
    // ignore
  }
};
