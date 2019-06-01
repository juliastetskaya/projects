export default (tag, classNames, textNode = null) => {
  const element = document.createElement(tag);
  if (classNames !== undefined) {
    const classes = classNames.split(' ');
    classes.forEach(className => element.classList.add(className));
  }

  if (textNode !== null) {
    const elementNode = document.createTextNode(textNode);
    element.append(elementNode);
  }
  return element;
};
