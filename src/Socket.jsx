import { io } from 'socket.io-client';

const socket = io('https://chatapp3-9h76.onrender.com', {
  transports: ['websocket'], // Ensuring only websocket transport is used
  reconnectionAttempts: 5, // Number of reconnection attempts before giving up
  reconnectionDelay: 1000, // Delay between reconnection attempts
  autoConnect: true // Automatically connect on instantiation
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});

socket.on('connect_timeout', () => {
  console.error('Connection timeout');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Reconnection attempt:', attemptNumber);
});

export default socket;