const errorMessage = err => {
  return console.error(`${err.name}: ${err.message}`);
};

const fatalErrorMessage = message => {
  console.log(message);
  return process.exit(1);
};

module.exports = {
  errorMessage,
  fatalErrorMessage
};
