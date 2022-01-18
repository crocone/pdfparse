
const LOG = require("./lib/LOG.js");
const PFParser = require("pdf2json/pdfparser"); // doc: https://github.com/modesty/pdf2json

function forEachItem(pdf, handler) {
  let pageNumber = 0;
  const Pages = pdf.Pages || pdf.formImage.Pages;
  for (const p in Pages) {
    const page = Pages[p];
    const number = ++pageNumber;
    handler(null, {
      page: number,
      width: page.Width || (pdf.formImage ? pdf.formImage.Width : 0),
      height:
        page.Height ||
        (pdf.formImage ? pdf.formImage.Pages[number - 1].Height : 0),
    });
    for (const t in page.Texts) {
      let item = page.Texts[t];
      item.text = decodeURIComponent(item.R[0].T);
      handler(null, item);
    }
  }
  handler();
}

function PdfParse(options) {
  LOG("PdfParse");
  this.options = options || {};
}


PdfParse.prototype.parseFileItems = function (pdfFilePath, itemHandler) {
  itemHandler(null, { file: { path: pdfFilePath } });
  const pdfParser = new PFParser();
  if (this.options.password) {
    pdfParser.setPassword(this.options.password);
  }
  pdfParser.on("pdfParser_dataError", itemHandler);
  pdfParser.on("pdfParser_dataReady", function (pdfData) {
    forEachItem(pdfData, itemHandler);
  });
  const verbosity = this.options.debug ? 1 : 0;
  pdfParser.loadPDF(pdfFilePath, verbosity);
};

/**
 * parseBuffer: calls itemHandler(error, item) on each item parsed from the pdf file received as a buffer
 */
PdfParse.prototype.parseBuffer = function (pdfBuffer, itemHandler) {
  itemHandler(null, { file: { buffer: pdfBuffer } });
  const pdfParser = new PFParser();
  if (this.options.password) {
    pdfParser.setPassword(this.options.password);
  }
  pdfParser.on("pdfParser_dataError", itemHandler);
  pdfParser.on("pdfParser_dataReady", function (pdfData) {
    forEachItem(pdfData, itemHandler);
  });
  const verbosity = this.options.debug ? 1 : 0;
  pdfParser.parseBuffer(pdfBuffer, verbosity);
};

module.exports = PdfParse;
