require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use( express.static( path.resolve(__dirname, '../public')));
app.use('/css', express.static( path.resolve(__dirname, '../node_modules/bootstrap/dist/css')));
app.use( require('./routes/index') );

mongoose.connect(process.env.URLDB, (err, resp) => {
  if(err){
    throw err;
  }
  console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
})
