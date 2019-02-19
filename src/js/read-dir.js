const fs = require('fs');
const path = require('path');
const streamWrite = require('./sream-write');
const { errorMessage } = require('./error-message');
const anyDir = require('./create-any-dir');

const dirName = {};

const readFiles = (file, pathName, outputDirName) => {
  const fullPathName = path.join(pathName, file);
  fs.stat(fullPathName, (err, data) => {
    if (err) {
      return errorMessage(err);
    }
    if (data.isDirectory()) {
      readDir(fullPathName, outputDirName);
    } else {
      const parseName = path.parse(fullPathName);
      dirName[parseName.name[0]] = dirName[parseName.name[0]] + 1 || 0;
      const pathDirName = path.join(path.normalize(`${__dirname}/../..`), outputDirName, parseName.name[0]);
      const config = {
        callback: streamWrite,
        pathJoin: path.join(pathDirName, parseName.base),
        fullPathName
      };
      dirName[parseName.name[0]]
        ? streamWrite(path.join(pathDirName, parseName.base), fullPathName)
        : anyDir(pathDirName, config);
    }
  });
};

const readDir = (pathName, outputDirName) => {
  fs.readdir(pathName, (err, files) => err
    ? errorMessage(err)
    : files.forEach(file => readFiles(file, pathName, outputDirName)));
};

module.exports = readDir;
