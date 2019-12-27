const path = require('path');
const fs = require('fs');
const Component = require('../component');
const { readFile } = require('../../modules/utils');

module.exports = class Form extends Component {
  constructor(options) {
    super({
      cssPath: path.join(__dirname, 'form.css'),
      htmlPath: path.join(__dirname, 'form.html'),
      parent: options.parent,
      replace: options.replace,
    });
    this.showNextPage = options.onNext;
    this.nextButton = document.querySelector('button');
    this.settings = options.settings;
    this.selectGroundType = this.selectGroundType.bind(this);
  }

  selectGroundType(event) {
    const target = event.currentTarget;
    if (target.classList.contains('selected')) {
      target.classList.remove('selected');
      this.settings.groundType = undefined;
      this.nextButton.disabled = true;
    } else {
      const prevSelected = document.querySelector('.selected');
      if (prevSelected)
        prevSelected.classList.remove('selected');
      target.classList.add('selected');
      this.settings.groundType = target.dataset.groundType;
      this.nextButton.disabled = false;
    }
  }

  rememberSelection = (event) => {
    this.rememberGroundType = event.target.checked;
  };

  startCarCommunication() {
    if (this.rememberGroundType) this.saveSelectedGroundType();
    this.sendShimSignal(this.selectedGround);
    this.showNextPage();
  }

  saveSelectedGroundType() {
    fs.writeFile(
      path.join(path.dirname(require.main.filename), 'settings.json'),
      JSON.stringify(settings),
      {
        encoding: 'utf-8',
      }
    );
  }

  sendShimSignal(groundType) {
    // gpio code here
  }
};
