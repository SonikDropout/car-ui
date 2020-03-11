const App = require('./components/App').default;

const options = {
  target: document.body,
};
const app = new App(options);

Object.defineProperty(Array.prototype, 'last', {
  get: function() {
    return this[this.length - 1];
  },
});

module.exports = app;
