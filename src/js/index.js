const express = require('express');
const moment = require('moment');
const app = express();
const argv = process.argv.slice();
const valid = param => Number.isFinite(+param);
const isValid = argv.length > 2 && valid(argv[2]) && valid(argv[3]);
let time;
moment.locale('ru');
const getime = () => moment().format('LL, LTS');

process.on('exit', code => {
  if (code === 1) {
    console.error('Первый и второй аргументы должны быть цифрами');
  }
});

if (!isValid) process.exit(1);

const timer = () => {
  time = setTimeout(() => {
    console.log(getime());
    timer();
  }, argv[2]);
};

app.get('/', (req, res) => {
  timer();
  setTimeout(() => {
    clearTimeout(time);
    res.send(getime());
  }, argv[3]);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App start');
});
