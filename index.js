const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria para usuarios
const usuarios = [];

// Servir la interfaz gráfica desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz: carga la interfaz web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de estado del servicio (API)
app.get('/api/health', (req, res) => {
  res.json({
    exito: true,
    mensaje: "Servicio Web de Autenticación para Joyería Dala activo",
    version: "1.0.0"
  });
});

// --- RUTAS DE AUTENTICACIÓN ---

// Registro de usuario
app.post('/api/auth/register', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ exito: false, mensaje: "Todos los campos son obligatorios" });
  }

  const usuarioExiste = usuarios.find(u => u.email === email);
  if (usuarioExiste) {
    return res.status(400).json({ exito: false, mensaje: "El correo electrónico ya está registrado" });
  }

  const nuevoUsuario = { id: usuarios.length + 1, nombre, email, password };
  usuarios.push(nuevoUsuario);

  res.status(201).json({
    exito: true,
    mensaje: "Usuario registrado con éxito",
    usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
  });
});

// Inicio de sesión
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ exito: false, mensaje: "Todos los campos son obligatorios" });
  }

  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
  }

  res.json({
    exito: true,
    mensaje: "Inicio de sesión exitoso",
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
  });
});

// Comodín para SPA (Express v5)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});