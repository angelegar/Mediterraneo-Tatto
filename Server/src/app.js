// creacion del server
import express from 'express';
//importa BD
import db from './db.js';
import cors from 'cors';
//manejar rutas de archivos y directorios en Node.js
import path from 'path';

// Se crea una instancia de la app Express, que será el server web
const app = express();

// Configuración del servidor
//permite que el servidor acepte peticiones desde diferentes dominios
app.use(cors());
//habilita el parsing JSON en las solicitudes HTTP, permite req.body
app.use(express.json());

// Ruta de registro
app.post('/register', (req, res) => {
    //extrae del usuario enviados en la solicitud POST
    const { Id, Nombre, Email, Password, Rol } = req.body;
    //Usamos el ? para evitar inyeccion SQL
    const query = 'INSERT INTO usuario (ID, Nombre, Email, Password, Rol) VALUES (Null, ?, ?, ?, ?)';
    db.query(query, [Nombre, Email, Password, Rol], (err, result) => {
        //Ejecuta y pasa a un callback con err y result que da como resultado la query
        if (err) {
            console.error('Error al registrar usuario:', err);
            //Se envia un respuesta 500 (Error del Servidor) con un mensaje y detalles del error
            res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
            return;
        }
        //el codigo 201 es creado
        res.status(201).json({ message: 'Usuario registrado correctamente', result });
    });
});

export default app;
