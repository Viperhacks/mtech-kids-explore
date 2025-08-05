export const isElectron = () => {
  return typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    (window.process as any)?.type === 'renderer';
};
