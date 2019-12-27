const Component = require("../component");

module.exports = class ErrPage extends Component {
  constructor(options) {
    super({
      cssPath: path.join(__dirname, "error.css"),
      htmlPath: path.join(__dirname, "error.html"),
      parent: options.parent,
      replace: options.replace
    });
    this.reconnect = options.onNext;
  }
};
