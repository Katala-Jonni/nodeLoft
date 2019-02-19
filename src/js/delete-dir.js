const fs = require('fs');
const path = require('path');

const deleteDir = () => {
  let paths = [];
  const delDir = pathStartDir => {
    try {
      const startDirFiles = fs.readdirSync(pathStartDir);
      startDirFiles.forEach(file => {
        const namePath = path.join(pathStartDir, file);
        const fileStateInfo = fs.statSync(namePath);
        if (fileStateInfo.isDirectory()) {
          paths.push(namePath);
          delDir(namePath);
        } else {
          fs.unlinkSync(namePath);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  delDir(process.env.START_DEFAULT_DIR);
  paths
    .sort((a, b) => b.length - a.length)
    .forEach(file => fs.rmdirSync(path.join(file)));
  fs.rmdirSync(path.join(process.env.START_DEFAULT_DIR));
};

module.exports = deleteDir;
