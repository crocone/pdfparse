

function TableParser() {
  this.rows = {};
}

TableParser.prototype.processItem = function (item, col) {
  const row = (this.rows["" + item.y] = this.rows["" + item.y] || {});
  (row[col] = row[col] || []).push(item);
};

TableParser.prototype.processHeadingItem = function (item, col) {
  this.processItem(
    {
      y: 0,
      x: item.x,
      text: item.text,
    },
    col
  );
};

// Rows

function sortAsFloatValues(values) {
  return values.slice().sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });
}

TableParser.prototype.getRows = function () {
  const rows = this.rows;
  const yValues = sortAsFloatValues(Object.keys(rows));
  return yValues.map(function (y) {
    return rows["" + y];
  });
};

function renderRows(rows) {
  return (rows || [])
    .map(function (row, rowId) {
      const cells = [];
      for (const i in row)
        for (const j in row[i]) cells.push(row[i][j].x + ": " + row[i][j].text);
      return rowId + ":\t" + cells.join(", ");
    })
    .join("\n");
}

TableParser.prototype.renderRows = function () {
  return renderRows(this.getRows());
};

// Matrix

function getSortedXValues(rows) {
  const xSet = {};
  for (const y in rows) for (const x in rows[y]) xSet[x] = true;
  return sortAsFloatValues(Object.keys(xSet));
}

TableParser.prototype.getMatrix = function () {
  const rows = this.getRows();
  const xValues = getSortedXValues(rows);
  return rows.map(function (row, y) {
    const rowNew = [];
    for (const x in row) {
      const items = row[x];
      const colN = xValues.indexOf(x);
      rowNew[colN] = (rowNew[colN] || []).concat(items);
    }
    return rowNew;
  });
};

function getText(item) {
  return item.text;
}

function joinCellCollisions(separ) {
  return function (cell) {
    return (cell || []).map(getText).join(separ).substr(0, 7);
  };
}

function renderMatrix(matrix) {
  return (matrix || [])
    .map(function (row) {
      return (row || []).map(joinCellCollisions("+")).join("\t");
    })
    .join("\n");
}

TableParser.prototype.renderMatrix = function () {
  return renderMatrix(this.getMatrix());
};

module.exports = TableParser;
