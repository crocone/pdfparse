

const LOG = require("./LOG.js");

function getColumnIndex(cols, x) {
  let bestDist = null;
  for (const i = 0; i < cols.length; ++i) {
    const dist = Math.abs(x - cols[i].x);
    if (bestDist !== null && dist > bestDist) {
      break;
    } else {
      bestDist = dist;
    }
  }
  return i - 1;
}

function ColumnsParser(colNames) {
  this.cols = [];
  let cols = this.cols
  colNames = colNames.slice()
  let line = -1

  this.processItem = function (item) {
    if (line == -1) {
      // parse x-position of column headers
      let i = colNames.indexOf(item.text);
      if (i > -1) {
        LOG("ColumnsParser header", i, item.text, "=> x:", item.x);
        cols[i] = {
          name: item.text,
          x: item.x,
          items: [],
        };
        colNames[i] = ""; // needed so that a column name can be associated to more than 1 index
      }
      if (cols.length == colNames.length) {
        // done parsing header
        line++;
      }
    } else {
      cols[getColumnIndex(cols, item.x)].items.push(item);
    }
  };
}

module.exports = ColumnsParser;
