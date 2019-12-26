export function createElement(tag, attributes) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element[key] = attributes[key];
  }
  return element;
}
