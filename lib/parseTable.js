
function getTopPos(item) {
  return item.y;
}

function getLeftPos(item) {
  return item.x;
}

function getText(item) {
  return item.text;
}

/**
 * makeClassifier(): makes a classifier, based on an array of numbers and an expected number of clusters.
 * nbClusters: expected number of clusters
 * arr: array of numbers
 * => returns a function that takes a number, and returns the number of its corresponding column.
 **/
function makeFloorClassifier(nbClusters, arr) {
  let min = Math.min.apply(Math, arr);
  const delta = Math.max.apply(Math, arr) - min;
  min -= delta / nbClusters / 2;
  return function classify(value) {
    return Math.floor((nbClusters * (value - min)) / delta);
  };
}

function makeColumnClassifier(header) {
  const colX = [0].concat(header.map(getLeftPos)).sort(function (a, b) {
    return a - b;
  });
  return function classify(item) {
    for (const i = colX.length - 1; i > -1; --i)
      if (getLeftPos(item) >= colX[i]) return i;
  };
}

function buildRowList(items, classifyRow) {
  const rows = [];
  for (const i in items) {
    const item = items[i];
    const row = classifyRow(getTopPos(item));
    (rows[row] = rows[row] || []).push(item);
  }
  return rows;
}

function joinCellCollisions(separ) {
  return function (cell) {
    return (cell || []).map(getText).join(separ).substr(0, 7);
  };
}

function fillTab(str) {
  return str.substr(0, 7);
}

function renderTable(table) {
  return (table || [])
    .map(function (row) {
      return (row || []).map(fillTab).join("\t");
    })
    .join("\n");
}

function renderMatrix(matrix) {
  return (matrix || [])
    .map(function (row) {
      return (row || []).map(joinCellCollisions("+")).join("\t");
    })
    .join("\n");
}

function renderRows(rows) {
  return (rows || [])
    .map(function (row, rowId) {
      const cells = [rowId + ":"];
      for (const i in row)
        cells.push((Math.floor(row[i].x) + ":" + row[i].text).substr(0, 7));
      return cells.join("\t");
    })
    .join("\n");
}

function renderItems(items) {
  return items
    .map(function (i) {
      return [i.y, i.x, i.text].join("\t");
    })
    .join("\n");
}

function buildMatrix(rows, classifyColumn) {
  const matrix = [];
  for (const y in rows) {
    const row = [];
    for (const x in rows[y]) {
      const item = rows[y][x];
      const colN = classifyColumn(item);
      (row[colN] = row[colN] || []).push(item);
    }
    matrix.push(row);
  }
  return matrix;
}

function detectCollisions(matrix) {
  const collisions = [];
  (matrix || []).map(function (row, rowN) {
    (row || []).map(function (cellItems, colN) {
      if (cellItems.length > 1)
        collisions.push({
          row: rowN,
          col: colN,
          items: cellItems,
        });
    });
  });
  return collisions;
}

function makeAccumulator(nbRows, headerRow) {
  const rule = this,
    items = [];

  rule.nbRows = nbRows || 0;
  rule.output = {
    items: items,
    rows: null,
    matrix: null,
  };

  function accumulate(item) {
    items.push(item);
  }

  // when parsing is done: generate a clean table, from items.
  rule.whenDone(function () {
    // classify items into rows
    const classifyRow = makeFloorClassifier(rule.nbRows, items.map(getTopPos));
    //LOG(items.map(function(i){ return [getTopPos(i), classifyRow(getTopPos(i)), i.text].join("\t"); }).join("\n"));
    this.output.rows = buildRowList(items, classifyRow);
    // classify row items into columns
    const classifyColumn = makeColumnClassifier(this.output.rows[headerRow || 0]);
    this.output.matrix = buildMatrix(this.output.rows, classifyColumn);
  });

  return accumulate; // then the same function will be run on all following items, until another rule is triggered
}

module.exports = makeAccumulator;
module.exports.renderItems = renderItems;
module.exports.renderRows = renderRows;
module.exports.renderMatrix = renderMatrix;
module.exports.renderTable = renderTable;
module.exports.detectCollisions = detectCollisions;
