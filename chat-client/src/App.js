import React, { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]); //estado para almacenar los mensajes
  const [message, setMessage] = useState(''); // estado para almacenar el mensaje actual
  const [ws, setWs] = useState(null); //estado para almacenar la conexión WebSocket

  //use effect se ejecuta cuando el componente se monta (cuando app carga por primera vez)
  useEffect(() => {
    // Conectar con el servidor WebSocket
    const socket = new WebSocket('ws://10.20.153.104:8080'); //ip red local cetys alumnos
    setWs(socket); //guardar la conexión en el estado

    //configurar para manejar eventos de la conexión
    socket.onmessage = (event) => {
      // Verificar si el mensaje es un Blob y convertirlo a texto (objeto binario)
      if (event.data instanceof Blob) {
        const reader = new FileReader(); //crear lector de archivos
        reader.onload = () => {
          //add messages una vez que se convierten desde objt binario a texto
          const message = reader.result;
          setMessages((prevMessages) => [...prevMessages, message]); //actualizsr mensajes
        };
        reader.readAsText(event.data); //leer blob como texto
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]); //si el msg ya es txt entonces si agrega directamente
      }
    };
    
    //config para desconectar
    socket.onclose = () => {
      console.log('Conexión cerrada');
    };

    return () => socket.close();
  }, []);

  //funcion para enviar mensajes
  const handleSendMessage = () => {
    //verificar que conexion websocket este abierta antes de enviar mensaje
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message); //send mensaje al servidor
      setMessage(''); // Limpiar el campo después de enviar el mensaje
    }
  };

  //regresa estructura de la app
  return (
    <div>
      <h1>Chat god</h1>
      <div style={{ border: '3px solid black', padding: '30px', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => ( 
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}

export default App;
