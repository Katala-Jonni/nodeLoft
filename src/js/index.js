const fs = require('fs');
const path = require('path');
const util = require('util');
const readDir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);
const fsMkDir = util.promisify(fs.mkdir);
const fsCopyFile = util.promisify(fs.copyFile);
const fsRmDir = util.promisify(fs.rmdir);
const deleteFile = require('./deleteFile');
const readDirIntoInputDir = require('./readDirIntoInputDir');
const outputFiles = {};
let pathDirs = [];
const random = () => Math.floor(Math.random() * 1000);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  process.exit(1);
});

const configArgv = {
  input: process.argv[2] || 'any-dir',
  output: process.argv[3] || `dist${random() + random()}`,
  deleteInput: process.argv[4] || false
};

(async () => {
  try {
    const inputDirPath = path.join(process.cwd(), configArgv.input);
    const stat = await fsStat(inputDirPath);
    if (stat.isDirectory()) {
      const files = await readDir(inputDirPath);
      for await (let file of files) {
        await readDirIntoInputDir(path.join(inputDirPath, file), outputFiles);
      }

      const outputDirPath = path.join(process.cwd(), configArgv.output);
      await fsStat(outputDirPath).catch(() => fsMkDir(outputDirPath));

      for await (const dir of Object.keys(outputFiles)) {
        const dirPath = path.join(outputDirPath, dir);
        await fsStat(dirPath).catch(() => fsMkDir(dirPath));
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        for await (const file of outputFiles[dir]) {
          const parseFilePath = path.parse(file);
          await fsCopyFile(file, path.join(dirPath, parseFilePath.base));
        }
      }

      if (configArgv.deleteInput) {
        await deleteFile(inputDirPath, pathDirs);
        pathDirs.sort((a, b) => b.length - a.length);
        for await (let dir of pathDirs) {
          await fsRmDir(dir);
        }
        pathDirs = null;
      }
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return console.error(`Введите кооректный путь! ${path.parse(e.path).base} не является папкой`);
    }
  }
})();
