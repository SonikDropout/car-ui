const fs = require("fs");

exports.createElement = function(tag, attributes) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element[key] = attributes[key];
  }
  return element;
};

exports.collectTriggeredActions = function(event) {
  const triggerdActions = [];
  let currentNode = event.target;
  while (currentNode.parentElement) {
    if (currentNode.dataset.action)
      triggerdActions.push({
        type: currentNode.dataset.action,
        target: currentNode
      });
    currentNode = currentNode.parentElement;
  }
  return triggerdActions;
};

exports.readFile = function(path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });
};
