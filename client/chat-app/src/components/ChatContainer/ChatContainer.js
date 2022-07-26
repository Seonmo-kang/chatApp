import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import axios from "axios";
import { getMessageRoute } from '../../utils/APIRoutes';
const ChatContainer = ({ arrivalMessage, currentUser, currentChat, handleSendMessage}) => {

  const [message, setMessage] = useState("");
  const [messageList, setMessageList ] = useState([]);
  //When message arrive, changed MessageList.

  useEffect(()=>{
    arrivalMessage && setMessageList((prev)=>[...prev,arrivalMessage]);
  },[arrivalMessage]);

  useEffect(()=>{
    const getMessageList = async () =>{
      if(currentChat !== undefined){
        const msg = await axios.post(getMessageRoute,{
          from: currentUser._id,
          to:currentChat._id,
        }).then( (result)=>{
          console.log(result);
            setMessageList(result.data);
        }).catch( (ex)=>{
          console.log(ex);
        });
      }
    }
    getMessageList();
  },[currentChat]);
  // send message to server
  const sendMessage = async (e) =>{
    e.preventDefault();
    if(message.length>0){
      handleSendMessage(message);
      setMessage("");
      const newMessageList = [...messageList];
      newMessageList.push({
        fromSelf:true,
        message:message
      });
      setMessageList(newMessageList);
    }
  }
  return (
    <Container>
    <div id="messages">
      {
        messageList.map((msg,index)=>{
          return(
            <div key={index} className={`message ${msg.fromSelf? 'sended' : 'received'}`} >
              <div className='content'>
                <p>{msg.message}</p>
              </div>
            </div>
          )
        })
      }
    </div>
    <form id="form" action="">
    <input id="input" autoComplete="off" onChange={(e)=>{setMessage(e.target.value)}} value={message}/>
    <button id="btn" onClick={ e=>{sendMessage(e)}}>Send</button>
    </form>
  </Container>
  )
}
const Container = styled.div`
  width:100%;
  height:100%;
  #messages{
      width:100%;
      height: calc( 70% - 3rem );
      list-style-type: none;
      overflow:auto;
      margin: 0;
      padding: 0;
      .message {
        display:flex;
        align-item:center;
        color: black;
        padding: 0.5rem 1rem;
        .content{
          max-width:50%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size:1.1rem;
        }
      }
      .sended{
          justify-content:flex-end;
          background: #efefef;
      }
      .received{
        justify-content:flex-start;
      }
  }
  #form{
    background: rgba(0, 0, 0, 0.35);
    padding: 0.25rem;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 3rem;
    border-radius: 0px 0px 2rem 2rem;
    box-sizing: border-box;
    backdrop-filter: blur(10px);

    #input {
      border: none;
      padding: 0 1rem;
      flex-grow: 1;
      border-radius: 2rem;
      margin: 0.25rem;
    }
    #input:focus {
      outline: none;
    }

    #btn {
      background: #333;
      border: none;
      padding: 0 1rem;
      margin: 0.3rem;
      border-radius: 3px;
      outline: none;
      color: #fff;
      transition: background 0.5s;
    }
  }
  @media only screen and (min-width:1250px){
    #messages{
      width: 100%;
      height: calc( 100% - 3rem );
      display:flex;
      flex-direction:column;
      gap:1rem;
      overflow:auto;

    }
    #form {
      position: absolute;
      width: 76.05%;
      left: 23.95%;
      border-radius: 0 0 2rem 0;
    }
  } 
  @media screen and (max-width: 310px){
    #form {
      flex-wrap:wrap;
      input{
        padding: 0.55rem;
      }
      #btn{
        padding: 0.55rem;
        width:100%;
      }
    }
  }
`;

export default ChatContainer