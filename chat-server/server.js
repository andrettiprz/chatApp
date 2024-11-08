const WebSocket = require('ws'); // Importar la librería WebSocket (ws) que permite crear un servidor WebSocket
const server = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });
// Crear un nuevo servidor WebSocket que escucha en el puerto 8080
// La opción `host: '0.0.0.0'` permite que el servidor esté disponible en todas las interfaces de red,

// Configurar el evento `connection` para manejar las nuevas conexiones de clientes
server.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar mensajes de los clientes
  socket.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`); //mostrar mensaje en consola
    // Enviar el mensaje a todos los clientes conectados
    server.clients.forEach((client) => {
      //comprobar si el cliente está conectado
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Manejar la desconexión
  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

//confirmar que esta funcionando el servidor
console.log('Servidor WebSocket escuchando en ws://localhost:8080');
