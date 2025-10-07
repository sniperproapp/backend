import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// El decorador @WebSocketGateway convierte la clase en un servidor WebSocket.
// Aquí configuramos CORS para permitir la conexión desde tu app de Angular.
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200', // La URL de tu Angular App
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // @WebSocketServer() nos da acceso a la instancia del servidor de Socket.IO
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Este es el método CLAVE que usaremos para transmitir el mensaje a todos.
  // Lo hacemos público para poder llamarlo desde nuestro controlador HTTP.
  broadcastNuevaLeyenda(mensaje: string) {
    console.log(`Transmitiendo leyenda a todos los clientes: ${mensaje}`);
    this.server.emit('nueva-leyenda', { mensaje });
  }
}