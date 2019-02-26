const fs = require('fs');
const path = require('path');
const util = require('util');
const readDir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);

const readDirIntoInputDir = async (pathName, outputFiles) => {
  const fileInputDir = await fsStat(pathName);
  if (fileInputDir.isDirectory()) {
    const files = await readDir(pathName);
    if (!files.length) return;
    for await (let file of files) {
      await readDirIntoInputDir(path.join(pathName, file), outputFiles);
    }
  } else {
    const fileInfo = path.parse(pathName);
    outputFiles[fileInfo.name[0]] = [...outputFiles[fileInfo.name[0]] || '', pathName];
  }
};

module.exports = readDirIntoInputDir;
