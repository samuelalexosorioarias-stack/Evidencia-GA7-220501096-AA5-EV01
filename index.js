const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Datos en memoria
const usuarios = [];
const productos = [
  { id: 101, nombre: 'Anillo de Oro 18K', categoria: 'Anillos', precio: 450000, imagen: 'https://via.placeholder.com/150' },
  { id: 102, nombre: 'Cadena de Plata Ley 925', categoria: 'Cadenas', precio: 180000, imagen: 'https://via.placeholder.com/150' },
  { id: 103, nombre: 'Dije de Esmeralda', categoria: 'Dijes', precio: 320000, imagen: 'https://via.placeholder.com/150' }
];
const carrito = [];

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({ estado: 'OK', mensaje: 'Servidor de Joyería Dala activo' });
});

// 2. Registro
app.post('/api/auth/register', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ exito: false, mensaje: 'Todos los campos son requeridos' });
  }
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ exito: false, mensaje: 'El correo electrónico ya existe' });
  }
  const nuevo = { id: usuarios.length + 1, nombre, email, password };
  usuarios.push(nuevo);
  res.status(201).json({ exito: true, mensaje: 'Usuario registrado exitosamente' });
});

// 3. Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas' });
  }
  res.json({ exito: true, mensaje: 'Bienvenido', usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
});

// 4. Catálogo de Productos
app.get('/api/productos', (req, res) => {
  res.json({ exito: true, productos });
});

// 5. Carrito de Compras
app.post('/api/carrito', (req, res) => {
  const { productoId, cantidad } = req.body;
  const prod = productos.find(p => p.id === productoId);
  if (!prod) return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
  
  const item = { id: carrito.length + 1, producto: prod, cantidad };
  carrito.push(item);
  res.json({ exito: true, mensaje: 'Producto agregado al carrito', carrito });
});

app.listen(PORT, () => {
  console.log(`Servidor de Joyería Dala activo en http://localhost:${PORT}`);
});