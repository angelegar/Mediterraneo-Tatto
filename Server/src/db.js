// const express = require('express');
import mysql from 'mysql';
// const mysql = require('mysql');
// const bodyParser = require ('body-parser');

// const app = express();

//Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    //192.168.1.21 localhost
    //  port: '3306',
    user: 'amor',
    password: '1234',
    database: 'usuarios',
});

//Conexion de base de datos
db.connect((err)=>{
    if(err) {
        throw err;
    }
    console.log("Conectado con éxito!!!!");
});

//  const nuevoregistro = "INSERT INTO usuario (Id, Nombre, Email, Password, Rol) VALUES(NULL, 'Andrea', 'andrea@gmail.com', '12345', '3') ";
//  db.query(nuevoregistro, function(error, rows){
//      if(error){
//          throw error;
//     }else{
//          console.log('Datos insertados correctamente');
//      }
//  });

//  db.query(query, [Nombre, Email, Password], (err, result) => 
//      { if (err) { console.error('Error al registrar usuario:', err); 
//          res.status(500).json({ message: 'Error al registrar usuario' }); 
//          return; }
//           res.status(201).json({ message: 'Usuario registrado correctamente' }); 
//          }); 
  

export default db;