const Component = require('../component');
const path = require('path');

module.exports = class Loader extends Component {
  constructor(options) {
    super({
      cssPath: path.join(__dirname, 'loader.css'),
      htmlPath: path.join(__dirname, 'loader.html'),
      parent: options.parent,
      replace: options.replace,
    });
    this.animateText();
  }
  animateText() {
    const loadingText = document.querySelector('.loading');
    let i = 1;
    function updateLoadingText() {
      loadingText.innerText = 'Соединение' + Array((++i % 4) + 1).join('.');
      setTimeout(updateLoadingText, 300);
    }
    updateLoadingText();
  }
};
