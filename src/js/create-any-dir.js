const fs = require('fs');
const { errorMessage } = require('./error-message');

const writeEnd = config => {
  const { callback, fullPathName, pathJoin } = config;
  callback(pathJoin, fullPathName);
};

const createAnyDir = (pathName, config) => {
  try {
    fs.statSync(pathName);
    config && writeEnd(config);
  } catch (e) {
    fs.mkdir(pathName, e => {
      if (e) {
        return errorMessage(e);
      }
      config && writeEnd(config);
    });
  }
};

module.exports = createAnyDir;
