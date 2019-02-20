const fs = require('fs');
const path = require('path');
const { errorMessage } = require('./error-message');
const readDir = require('./read-dir');

const scanDir = (output, input, config) => {
  fs.mkdir(path.join(path.dirname(process.env.START_DEFAULT_DIR), output), err => {
    if (err) {
      return errorMessage(err);
    }
    return readDir(path.join(input, config.inputDir), config.outputDir);
  });
};

module.exports = scanDir;
