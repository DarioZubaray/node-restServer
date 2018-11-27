/*
Puerto
*/
process.env.PORT = process.env.PORT || 3000;

/*
Entorno
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
Vencimiento del token
*/

process.env.CADUCIDAD_TOKEN = 60*60*24*30;

/*
SEED de autenticacion
*/

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-de-desarrollo';

/*
Base de datos
*/
let urlDB;

if(process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/*
google ClientID
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '960302424220-b0cko20oiu4gpdd819aoejo1n3f96gse.apps.googleusercontent.com';
