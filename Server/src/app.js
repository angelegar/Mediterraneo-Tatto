// creacion del server
import express from 'express';
//importa BD
import db from './db.js';
import cors from 'cors';
//manejar rutas de archivos y directorios en Node.js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';


// Definir __dirname para ES Modules
//filename : ruta absoluta del archivo actual
//dirname : ruta absoluta del directorio del archivo 
// se usa ES Modules porque Node.js no proporciona estas variables automaticamente como CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Se crea una instancia de la app Express, que será el server web
const app = express();

// Configuración del servidor
//permite que el servidor acepte peticiones desde diferentes dominios
app.use(cors());
//habilita el parsing JSON en las solicitudes HTTP, permite req.body
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'src/upload')));

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



// Ruta de inicio de sesión
app.post('/login', (req, res) => {

    const { Email, Password } = req.body;

    const query = 'SELECT * FROM usuario WHERE Email = ? AND Password = ?';

    db.query(query, [Email, Password], (err, result) => {

        if (err) {
            console.error('Error al verificar usuario:', err);
            res.status(500).json({ message: 'Error en el servidor', error: err.message });
            return;
        }

        //devuelve al menos un resultado, significa que el usuario exite y la contraseña es correcta
        if (result.length > 0) {
            //se envia una respuesta 200 (ok) con un obj JSON que contiene un mensaje y datos del usuario
            res.status(200).json({
                message: 'Login exitoso',
                user: {
                    Id: result[0].ID,
                    Nombre: result[0].Nombre,
                    Email: result[0].Email,
                    Rol: result[0].Rol
                }
            });
            //el usuario no existe o la contarseña es incoreecta se envia el 401(Unauthorized) Y un mensaje
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }

    });

});


// Ruta para crear un nuevo artista
// middleware de multer maneja la carga de archivos, solo sube un archivo a la vez
// espera un campo llamado 'photo' en la solitud (req.file)
app.post('/artists', upload.single('photo'), (req, res) => {
    // extrae el valor empleado desde el cuerpo de la solitud(req.body), respresenta el nombre del artista o su ID
    const { empleado } = req.body;
    //req.file exite se almacena su ruta en la variable photo
    const photo = req.file ? `src/upload/${req.file.fileempleado}` : null;
    const query = 'INSERT INTO artists (empleado, photo) VALUES (?, ?)';
    db.query(query, [empleado, photo], (err, result) => {
        if (err) {
            console.error('Error al crear artista:', err);
            //Codigo de error 500(error del servidore)
            res.status(500).json({ message: 'Error al crear artista', error: err.message });
        } else {
            res.status(201).json({ message: 'Artista creado correctamente', result });
        }
    });
});

// Ruta para obtener la lista de artistas

app.get('/artists', (req, res) => {
    // Ajusta el nombre de la tabla según tu base de datos
    const query = 'SELECT id, empleado, photo FROM artists';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de artists:', err);
            res.status(500).json({ message: 'Error al obtener la lista de artists' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Ruta para insertar productos
app.post('/product', upload.single('foto'), (req, res) => {

    const { fecha_edicion, empleado, precio, titulo } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null; // Ruta del archivo guardado

    const query = `INSERT INTO productos (fecha_edicion, empleado, foto, precio, titulo)VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [fecha_edicion, empleado, foto, precio, titulo], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ message: 'Error al insertar producto' });
        } else {
            res.status(201).json({ message: 'Producto insertado correctamente', result });
        }
    });
});
export default app;
