export default (tag, classNames, ...children) => {
  const element = document.createElement(tag);
  if (classNames !== undefined) {
    const classes = classNames.split(' ');
    classes.forEach(className => element.classList.add(className));
  }

  children.forEach((child) => {
    if (typeof child !== 'string') element.appendChild(child);
    else element.appendChild(document.createTextNode(child));
  });

  return element;
};
