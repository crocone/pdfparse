const LOG = require("./lib/LOG.js").toggle(false);
const PdfParse = require("./index.js").PdfParse;

function printRawItems(filename, callback) {
  new PdfParse().parseFileItems(filename, function (err, item) {
    if (err) callback(err);
    else if (!item) callback();
    else if (item.file) console.log("file =", item.file.path);
    else if (item.page) console.log("page =", item.page);
    else if (item.x)
      console.log(
        [item.x, item.y, item.oc, item.A, Math.floor(item.w), item.text].join(
          "\t"
        )
      );
    else console.warn(item);
  });
}

const filename = process.argv[2];
if (!filename) {
  console.error("please provide the name of a PDF file");
} else {
  console.warn("printing raw items from file:", filename, "...");
  printRawItems(filename, function () {
    console.warn("done.");
  });
}
