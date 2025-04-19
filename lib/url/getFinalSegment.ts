const getFinalSegment = (str: string) => {
  if (!str) return;

  const parts = str.split("/");
  const lastPart = parts.pop();

  if (!lastPart) return;

  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};
