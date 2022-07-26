import React from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
const LogOut = () => {
  const navigate = useNavigate();
  const handleClick = () =>{
    localStorage.removeItem('chat-app-user');
    navigate('/login');
  }
  return (
    <Button onClick={handleClick}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      LogOut
    </Button>
  )
}
const neon_color = '#2196f3';
const Button = styled.button`
    position: relative;
    display: inline-block;
    padding: 0.5rem 0.3rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-decoration:none;
    overflow: hidden;
    transition:0.2s;
    background-color:transparent;
    color: white; 
    font-weight: 500;
    font-size: clamp(0.3rem,1.5vw,0.8rem);
    border: 1px solid white;
    &:hover{
        color: #255784;
        background: ${neon_color};
        box-shadow: 0 0 10px ${neon_color}, 0 0 40px ${neon_color}, 0 0 80px ${neon_color};
        transition-delay: 0.5s;
    }
    span{
        position: absolute;
        display:block;
    }
    span:nth-child(1){
        top:0;
        left: -100%;
        width:100%;
        height:4px;
        background: linear-gradient(90deg,transparent,${neon_color});
    }
    &:hover span:nth-child(1){
        left:100%;
        transition: 0.5s;
    }

    span:nth-child(2){
        top: -100%;
        right:0;
        width:4px;
        height:100%;
        background: linear-gradient(180deg,transparent,${neon_color}); 
    }
    &:hover span:nth-child(2){
        top:100%;
        transition: 0.5s;
        transition-delay: 0.125s;
    }

    span:nth-child(3){
        bottom:0;
        right: -100%;
        width: 100%;
        height: 4px;
        background: linear-gradient(270deg,transparent,${neon_color});
    }
    &:hover span:nth-child(3){
        right:100%;
        transition: 0.5s;
        transition-delay: 0.25s;
    }

    span:nth-child(4){
        bottom:-100%;
        left:0;
        width:4px;
        height: 100%;
        background: linear-gradient(360deg,transparent,${neon_color});
    }
    &:hover span:nth-child(4){
        bottom:100%;
        transition: 0.5s;
        transition-delay: 0.375s;
    }
`;

export default LogOut
