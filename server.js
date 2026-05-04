const app = require("./app/app.js"); // Aquí traemos todo lo configurado abajo

const PORT = 3000; // El puerto que pediste

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 Localhost: http://localhost:${PORT}`);
});