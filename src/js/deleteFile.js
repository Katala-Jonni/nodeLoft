const fs = require('fs');
const path = require('path');
const util = require('util');
const readDir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);
const fsUnLink = util.promisify(fs.unlink);

const deleteFile = async (pathName, pathDirs) => {
  const stat = await fsStat(pathName);
  if (stat.isFile()) {
    return fsUnLink(pathName);
  }
  const files = await readDir(pathName);
  if (!pathDirs.includes(pathName)) {
    pathDirs.push(pathName);
  }
  for await (let file of files) {
    await deleteFile(path.join(pathName, file), pathDirs);
  }
};

module.exports = deleteFile;
