function debounce(f, ms) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => f.apply(this, arguments), ms);
  };
}

module.exports = {
  debounce
}