## Node Rest Server - Demo

### Peticiones:
  - {{url}}/usuario?desde=0&hasta=10 _GET usuario_
  - {{url}}/usuario _POST usuario_
  - {{url}}/usuario/:id _PUT usuario_
  - {{url}}/usuario/:id _DELETE usuario_
  - {{url}}/login _POST login_

  - {{url}}/categoria _GET categoria_
  - {{url}}/categoria/:id _GET categoria por id_
  - {{url}}/categoria _POST categoria_
  - {{url}}/categoria/:id _PUT categoria_
  - {{url}}/categoria/:id _DELETE categoria_

  - {{url}}/productos?desde=0&hasta=10 _GET producto_
  - {{url}}/productos/:id _GET producto por id_
  - {{url}}/productos/buscar/:termino _GET producto por termino_
  - {{url}}/productos _POST producto_
  - {{url}}/productos/:id _PUT producto_
  - {{url}}/productos/:id _DELETE producto_

  - {{url}}/upload/:tipo/:id _PUT subir imagen por tipo y id_

  - {{url}}/ _index_


Recuerdar:
```
npm install
```


### Dependencias
  - [Express.js](https://www.npmjs.com/package/express) - [homepage](https://expressjs.com/es/)
  - [Express-fileupload](https://www.npmjs.com/package/express-fileupload) - [github](https://github.com/richardgirges/express-fileupload#readme)
  - [Body-parser](https://www.npmjs.com/package/body-parser) - [github](https://github.com/expressjs/body-parser#readme)
  - [mongoose](https://www.npmjs.com/package/mongoose) - [doc-guide](https://mongoosejs.com/docs/guide.html)
  - [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) - [github](https://github.com/blakehaswell/mongoose-unique-validator#readme)
  - [underscore](https://www.npmjs.com/package/underscore) - [homepage](https://underscorejs.org/)
  - [bcrypt](https://www.npmjs.com/package/bcrypt) - [github](https://github.com/kelektiv/node.bcrypt.js#readme)
  - [google-auth-library](https://www.npmjs.com/package/google-auth-library) - [github](https://github.com/google/google-auth-library-nodejs#readme)
  - [jwt.io](https://jwt.io/): [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - [github](https://github.com/auth0/node-jsonwebtoken#readme)
  - [bootstrap](https://www.npmjs.com/package/bootstrap) - [homepage](https://getbootstrap.com/)
