const express = require('express');
const cors = require("cors");
const http = require('http');
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messagesRoute");
const { Server } = require('socket.io');

const app = express();

// .env file config
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

mongoose.connect(process.env.ATLAS_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( ()=>{
    console.log("DB Connections Successfull");
}).catch( (err)=>{
    console.log(err.message);
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
// socket.io create and connect to the express server
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000", // front end
        credentials: true,
        methods: ["GET", "POST"],
    },
});
// Global var : onlineUsers
global.onlineUsers = new Map();
//When WebSocket is connected
io.on('connection', (socket)=>{
    
    global.chatSocket = socket;
    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id);
    })
    const req = socket.request; 
    // ip information
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('New client connected ',ip, socket.id);

    //When disconnect
    socket.on('disconnect',()=>{
        console.log(" Client disconnected : ", ip, socket.id);
        clearInterval(socket.interval);
    })

    //When error
    socket.on('error',(error)=>{
        console.error(error);
    });

    //When message from client
    socket.on('message_to_server',(data)=>{
        console.log(data);
        const receivedUserSocket = onlineUsers.get(data.to);
        if(receivedUserSocket){
            socket.to(receivedUserSocket).emit("message-receive",data.msg);
        }
    });
});

server.listen(PORT,()=> console.log (`Server running on port :${PORT}`));