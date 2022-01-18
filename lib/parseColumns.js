

const LOG = require("./LOG.js");

module.exports = function (/* columns */) {
  this.output = [];
  this.cols = Array.prototype.slice.apply(arguments);
  const colNames = this.cols
  let colX = [],
    rows = this.output,
    line = -1, // header
    lineY = null;
  function processItem(item) {
    if (line === -1) {
      // parse x-position of column headers
      const i = colNames.indexOf(item.text);
      if (i > -1) colX[i] = item.x;
      if (colX.length === colNames.length) {
        LOG("table header:", colNames, colX);
        line++;
      }
    } else {
      if (lineY === null) {
        lineY = item.y;
      } else if (lineY != item.y) {
        lineY = item.y;
        line++;
      }
      // parsing values for each column
      let col = 0;
      for (let i = colX.length - 1; i >= 0; --i)
        if (item.x > colX[i]) {
          col = i;
          break;
        }
      rows[lineY] = rows[lineY] || {};
      rows[lineY][col] = item.text;
    }
  }
  processItem(this.currentItem); // apply on header's first item
  return processItem; // then the same function will be run on all following items, until another rule is triggered
};
