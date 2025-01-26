
// export default app;

import express from 'express';
import db from './db.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Definir __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src/upload')));

// Configuración de multer para la galería
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/upload'); // Carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
    }
});

const upload = multer({ storage });

// Ruta para obtener la lista de artistas
app.get('/artists', (req, res) => {
    const query = 'SELECT id, empleado, photo FROM artists'; // Ajusta el nombre de la tabla según tu base de datos
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de artists:', err);
            res.status(500).json({ message: 'Error al obtener la lista de artists' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Ruta para crear un nuevo artista
app.post('/artists', upload.single('photo'), (req, res) => {
    const { empleado } = req.body;
    const photo = req.file ? `src/upload/${req.file.fileempleado}` : null;

    const query = 'INSERT INTO artists (empleado, photo) VALUES (?, ?)';
    db.query(query, [empleado, photo], (err, result) => {
        if (err) {
            console.error('Error al crear artista:', err);
            res.status(500).json({ message: 'Error al crear artista', error: err.message });
        } else {
            res.status(201).json({ message: 'Artista creado correctamente', result });
        }
    });
});

// Ruta de registro
app.post('/register', (req, res) => {
    const { Id, Nombre, Email, Password, Rol } = req.body;
    const query = 'INSERT INTO usuario (ID, Nombre, Email, Password, Rol) VALUES (Null, ?, ?, ?, ?)';
    db.query(query, [Nombre, Email, Password, Rol], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
            return;
        }
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
        if (result.length > 0) {
            res.status(200).json({
                message: 'Login exitoso',
                user: {
                    Id: result[0].ID,
                    Nombre: result[0].Nombre,
                    Email: result[0].Email,
                    Rol: result[0].Rol
                }
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    });
});

// Verificación de roles
const authorize = (roles) => (req, res, next) => {
    const { user } = req.body; // Se asume que el usuario está autenticado y enviado en la solicitud
    if (!roles.includes(user.Rol)) {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
    next();
};

// Solo los administradores pueden acceder a esta ruta
app.post('/admin-action', authorize([1]), (req, res) => {
    // Lógica para administradores
    res.json({ message: "Acción realizada por el administrador" });
});

// Los empleados y administradores pueden usar esta ruta
app.post('/employee-action', authorize([1, 2]), (req, res) => {
    // Lógica para empleados
    res.json({ message: "Acción realizada por un empleado o administrador" });
});

// Los clientes pueden usar esta ruta
app.get('/client-action', authorize([3]), (req, res) => {
    // Lógica para clientes
    res.json({ message: "Acción realizada por un cliente" });
});



//Ruta para mostrar
app.get('/products', (req, res) => { const query = 'SELECT * FROM productos'; // Ajusta el nombre de la tabla según tu base de datos 
db.query(query, (err, results) => { 
    if (err) { console.error('Error al obtener la lista de productos:', err); res.status(500).json({ message: 'Error al obtener la lista de productos' }); } else { 
        res.status(200).json(results); } }); });


// Ruta para insertar productos
 app.post('/product', upload.single('foto'), (req, res) => {
     const { fecha_edicion, empleado, precio, titulo } = req.body;
     const foto = req.file ? `/uploads/${req.file.filename}` : null; // Ruta del archivo guardado

     const query = `
         INSERT INTO productos (fecha_edicion, empleado, foto, precio, titulo)
         VALUES (?, ?, ?, ?, ?)
     `;
     db.query(query, [fecha_edicion, empleado, foto, precio, titulo], (err, result) => {
         if (err) {
             console.error('Error al insertar producto:', err);
             res.status(500).json({ message: 'Error al insertar producto' });
         } else {
             res.status(201).json({ message: 'Producto insertado correctamente', result });
         }
     });
 });
 // Ruta para obtener la lista de productos 
 app.get('/products', (req, res) => { 
    const query = ` SELECT p.*, a.empleado FROM productos p JOIN artists a ON p.empleado = a.id `; 
    // Ajusta según la estructura de tu base de datos 
    db.query(query, (err, results) => { 
        if (err) { console.error('Error al obtener la lista de productos:', err); 
            res.status(500).json({ 
                message: 'Error al obtener la lista de productos' }); }
                 else { res.status(200).json(results); } }); }); 

// Ruta para obtener trabajos de un artista específico
// app.get('/Product/:id/works', (req, res) => {
//     const artistId = req.params.id;
//     const query = 'SELECT t.*, p.foto FROM trabajos t JOIN productos p ON t.producto_id = p.id WHERE artista_id = ?'; // Ajustar según la estructura de tu base de datos
//     db.query(query, [artistId], (err, results) => {
//         if (err) {
//             console.error('Error al obtener trabajos del artista:', err);
//             res.status(500).json({ message: 'Error al obtener trabajos del artista' });
//         } else {
//             res.status(200).json(results);
//         }
//     });
// });

// app.get('Product/img/:id', (req, res) => { const id = req.params.id; const query = 'SELECT foto FROM productos WHERE id = ?'; 
//     // Ajusta según tu base de datos 
//     db.query(query, [id], (err, results) => { 
//         if (err) { console.error('Error al obtener la imagen:', err); res.status(500).json({ message: 'Error al obtener la imagen' }); return; } if (results.length > 0) { const img = results[0].foto; res.writeHead(200, { 'Content-Type': 'image/png', // Ajusta el tipo MIME según el formato de tu imagen 
//             'Content-Length': img.length }); res.end(img); } else { res.status(404).json({ message: 'Imagen no encontrada' }); } }); });

//
// app.get('/images/id', (req, res)=>{
//     const userId = req.params.id;
//     const query = 'SELECT foto FROM productos WHERE id = ?';
//     db.query(query, [userId], (err, result) => {
//         if (err) throw err;
 
//         if (result.length > 0) {
//           const fotoBuffer = result[0].foto;
//           res.setHeader('Content-Type', 'image/png');
//           res.send(fotoBuffer);
//         } else {
//           res.status(404).send('Imagen no encontrada');
//         }
//       });
//     });
app.get('/images/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT foto FROM productos WHERE id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
             const photoPath = path.join(__dirname,result[0].foto);
             res.sendFile(photoPath , (err) => {
                if (err) {
                    console.error('Error al enviar la imagen:', err);
                    res.status(500).send('Error al enviar la imagen');
                }
            });
        
            // const photoBuffer = result[0].foto; res.setHeader('Content-Type', 'image/png'); res.send(photoBuffer);
        } else {
            res.status(404).send('Imagen no encontrada');
        }
    });
});



export default app;
