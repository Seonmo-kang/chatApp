import React,{useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import axios from "axios";
import { ToastContainer, toast} from "react-toastify";
import { HOST , allUsersRoute, addMessageRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router';
import { Contacts, Welcome } from '../components';
import ChatContainer from '../components/ChatContainer/ChatContainer';

const formColor = 'rgb(236, 236, 236)';
const formShadow = 'rgba(236, 236, 236,0.4)';
const colorPurple = '#8a66ff';
const Container = styled.div`
  width:100vw;
  height:100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color : #313444;
  gap: 1rem;

  .chat-box{
    width:85vw;
    height:85vh;
    background: ${formColor};
    border-radius: 2rem;
    box-shadow: 0 0 10px ${formShadow}, 0 0 40px ${formShadow}, 0 0 80px ${formShadow};
    max-width:1000px;
    @media only screen and (min-width:1250px){
    /* chat-box */
      position:relative;
      display:flex;
      flex-direction:row;
    }
    @media screen and (max-width: 1249px){
      width:95vw;
      height:95vh;
    }
    @media screen and (max-width: 310px){
      width: 100vw;
      height: 95vh;
    }
  }
`;

const Chat = () => {

const [isConnected, setIsConnected] = useState(false);
const [isReceived, setIsReceived] = useState(false);

const [currentUser, setCurrentUser] = useState(undefined);
const [currentChat, setCurrentChat] = useState(undefined);
const [ contacts, setContacts ] = useState([]);
const [ isContactEmpty, setIsContactEmpty ] = useState(true);
const [ isLoaded, setIsLoaded ] = useState(false);
const [ arrivalMessage, setArrivalMessage ] = useState(null);
const navigate = useNavigate();

//socket.io-client
const socket = useRef();
useEffect(()=>{
  if(currentUser){
    socket.current = io(HOST);
    socket.current.emit('add-user',currentUser._id);
  }
},[currentUser]);

// handle message
const handleSendMessage = async (message) =>{
  const postMessage = await axios.post(addMessageRoute,{
    message: message,
    from: currentUser._id,
    to: currentChat._id,
  }).then(data=>{
    toast(data.data.msg);
  }).catch( ex =>{
    toast.error(ex);
  }); 
  socket.emit('message_to_server',{
    msg:message,
    to:currentChat._id,
    from: currentUser._id,
  });
  
}
// message received
useEffect(()=>{
  if(socket.current){
    socket.current.on('message-receive',msg=>{
      setArrivalMessage({fromSelf:false, message:msg});
    })
  }
},[]);

/* Get all user contacts */
// check user is loggined otherwise redirect to "/login"
useEffect( ()=>{
  if(!localStorage.getItem("chat-app-user")){
    navigate("/login");
  }else{
    setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    setIsLoaded(true);
  }
},[]);

// check user set an avatar up otherwise redirect to "/setAvatar"
useEffect(()=>{  
  if(currentUser){
    if(currentUser.isAvatarImageSet ){
      const getUser = axios.get(`${allUsersRoute}/${currentUser._id}`)
      .then((result)=>{
        setContacts(result.data);
      });
    }else{
      navigate("/setAvatar");
    } 
  }
},[currentUser]);

// socket connection and on
useEffect(()=>{
  if(socket.current){
    socket.current.on('connect',()=>{
      setIsConnected(true);
    });
    socket.current.on('disconnect',()=>{
      setIsConnected(false);
    });
    
    console.log("isConnected: ",isConnected);
    return () =>{
    socket.current.off('connect');  // socket.current.off = emitter.removeListener()
    socket.current.off('disconnect');
    }
  }
},[]);

// received message
useEffect(()=>{
  if(socket.current){
    socket.current.on('message_to_client', data =>{
      console.log("data.received: ",data.received);
      setIsReceived(data.received);
    });
  }
},[socket.current]);

useEffect(()=>{
  if( contacts !== []){
    setIsContactEmpty(false);
    console.log("IsContactEmpty: ",isContactEmpty);
  }
  console.log("contacts:",contacts);
},[contacts]);

const handleChatChange = (chat) =>{
  console.log("handleChatChange chat is ",chat);
  setCurrentChat(chat);
}
  return (
    <>
    <Container>
      <div className='chat-box'>
        { 
          isContactEmpty? <p>There is no contact in list.</p> : <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        }
        {
          isLoaded && currentChat===undefined?
            <Welcome currentUser={currentUser}/>
          : <ChatContainer 
            socket={socket}
            arrivalMessage={arrivalMessage}
            currentUser={currentUser}
            currentChat={currentChat} 
            handleSendMessage={handleSendMessage}/>
        }
      </div>
      <ToastContainer/>
    </Container>

  </>
  )
}

export default Chat;