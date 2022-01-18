
function SequentialParser(accumulators, callback) {
  let step = 0;
  const fields = {};
  return {
    fields: fields,
    addField: function (key, value) {
      this.fields[key] = value;
    },
    parseItem: function (item) {
      if (step >= accumulators.length) {
        return console.warn(
          "warning: skipping item, because SequentialParser is done."
        );
      }
      const current = accumulators[step];
      if (current.field) {
        this.addField(current.field, item);
        ++step;
      } else if (current.accumulator) {
        const doneAccumulating = current.accumulator(item, this);
        if (doneAccumulating) ++step;
      } // no action => skip item
      else ++step;
      if (!item || step >= accumulators.length) {
        callback && callback(null, this);
      }
    },
  };
}

module.exports = SequentialParser;
