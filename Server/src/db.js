import mysql from 'mysql';

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

  const nuevoregistro = "INSERT INTO usuario (Id, Nombre, Email, Password, Rol) VALUES(NULL, 'Andrea', 'andrea@gmail.com', '12345', '3') ";
  db.query(nuevoregistro, function(error, rows){
      if(error){
          throw error;
     }else{
          console.log('Datos insertados correctamente');
      }
  });

export default db;