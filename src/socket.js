import { io } from 'socket.io-client';

const socket = io('https://jewellery-backend-icja.onrender.com'); // your backend URL

export default socket;