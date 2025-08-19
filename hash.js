const bcrypt = require('bcrypt');

bcrypt.hash("654321", 10)
  .then(hash => {
    console.log("Hash generado:", hash);
  })
  .catch(err => {
    console.error("Error:", err);
  });


  //node hash.js
//Hacer un update en la tabla