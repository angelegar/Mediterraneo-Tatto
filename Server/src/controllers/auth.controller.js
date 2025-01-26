// export const register = (req, res) => {
//     const {Nombre, Email,Password,Rol}= req.body;

//     try {
//         const newUser = new User({
//             Nombre,
//             Email,
//             Password,
//             Rol
//         });
//         newUser.save();
//         res.send("Registrando");
//     } catch (error) {
 
//         throw error;
//     }
// };

// export const login = (req, res) => res.send("login");