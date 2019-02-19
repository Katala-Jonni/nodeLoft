const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);
const readDir = require('./read-dir');
const scanDir = require('./scan-dir');
const deleteDir = require('./delete-dir');
const { fatalErrorMessage } = require('./error-message');
const random = () => Math.floor(Math.random() * 1000);
const fatalMessage = 'Укажите верный путь к исходной папке';

const config = {
  inputDir: argv[0] || 'any-dir',
  outputDir: argv[1] || `dist${random() + random()}`,
  deleteStartPath: argv[2] || false
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  process.exit(1);
});

process.on('exit', code => !code && config.deleteStartPath && deleteDir());

const entry = (dirName, target) => {
  fs.stat(path.join(dirName, target), (err, data) => {
    if (err) {
      return dirName === '/'
        ? fatalErrorMessage(fatalMessage)
        : entry(path.dirname(dirName), config.inputDir);
    }
    if (data.isDirectory()) {
      process.env.START_DEFAULT_DIR = path.join(dirName, config.inputDir);
      fs.stat(path.join('../', config.outputDir), err => err
        ? scanDir(config.outputDir, dirName, config)
        : readDir(process.env.START_DEFAULT_DIR, config.outputDir));
    } else {
      return fatalErrorMessage(fatalMessage);
    }
  });
};

entry(__dirname, config.inputDir);
