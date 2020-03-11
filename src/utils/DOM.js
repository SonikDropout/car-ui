function getOffsetX(elem) {
  let x = 0
  
  while (elem) {
    x = x + elem.offsetLeft;
    elem = elem.offsetParent;
  }

  return x
}

function getOffsetY(elem) {
  let y = 0

  while (elem) {
    y = y + elem.offsetTop;
    elem = elem.offsetParent;
  }

  return y
}

module.exports = {
  getOffsetX,
  getOffsetY
}