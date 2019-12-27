const fs = require("fs");

module.exports = class Component {
  constructor({ cssPath, htmlPath, parent, replace = true }) {
    this.cssPath = cssPath;
    this.htmlPath = htmlPath;
    this.parent = parent;
    this.placeStylesheet();
    this.placeMarkup(replace);
    this.bindEventListeners();
  }

  bindEventListeners() {
    const interactiveElements = document.querySelectorAll('[data-action]');
    interactiveElements.forEach(this.attachClickHandler);
  }
  
  attachClickHandler = (element) => {
    if (typeof this[element.dataset.action] === 'function') {
      element.addEventListener('click', this[element.dataset.action].bind(this));
    }
  }

  placeStylesheet() {
    const style =
      document.querySelector("style") || document.createElement("style");
    style.innerHTML = fs.readFileSync(this.cssPath);
    document.head.appendChild(style);
  }

  placeMarkup(replace) {
    if (replace) this.parent.innerHTML = fs.readFileSync(this.htmlPath);
    else this.parent.appendChild(fs.readFileSync(this.htmlPath));
  }
};
