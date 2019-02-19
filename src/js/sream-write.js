const fs = require('fs');
const { pipeline } = require('stream');
const { errorMessage } = require('./error-message');

const write = (writePathName, readPathName) => {
  pipeline(
    fs.createReadStream(readPathName),
    fs.createWriteStream(writePathName),
    (err) => err && errorMessage(err)
  );
};

module.exports = write;
