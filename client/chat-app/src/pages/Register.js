import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom";
import styled, {keyframes} from 'styled-components';
import axios from "axios";

import purple_ballon from '../assets/images/purple_ballon.png';

import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from '../utils/APIRoutes';

const formColor = 'rgb(236, 236, 236)';
const formShadow = 'rgba(236, 236, 236,0.4)';
const colorPurple = '#8a66ff';

const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #313444;
  .form-box{
    background: ${formColor};
    border-radius: 2rem;
    box-shadow: 0 0 10px ${formShadow}, 0 0 40px ${formShadow}, 0 0 80px ${formShadow};
  }
  .brand{
    display:flex;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img{
      height:5rem;
    }
  }
  h1{

  }
  form{
    display:flex;
    flex-direction:column;
    gap:1rem;
    padding: 3rem 5rem;
    
    input{
      background-color:#ffffff;
      border-radius: 1em;
      padding: 0.55rem 1.25rem;
      color:#000000;
      font-size:1rem;
    }
    input:focus{
      font-weight:bold;
      background: #ffffff;
    }
    button{
      border-radius: 1rem;
      padding:1em;
      background-color:#2196f3;
      transition: 0.5s;
      font-size:1rem;
      font-weight:bold;
    }
    button:hover{
      background-color:#87cefa;
    }
    span{
      a{
        color:${colorPurple};
        font-weight: bold;
        transition: all 0.5s;
      }
    }
  }
`;
const Register = () => {
  const [values, setValues] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
  })
  const navigate = useNavigate();

  const handleChange = e =>{
    setValues({...values,[e.target.name]: e.target.value });
  }

  const handleSumbit = async (e) =>{
    e.preventDefault();
    if(handleValidation()){
      const { password, username, email } = values;
      console.log("in validation",registerRoute);
      const { data } = await axios.post(registerRoute,{
        username,
        email,
        password,
      });
      if( data.status===false ){
        toast.error(data.msg);
      }
      if( data.status===true ){
        localStorage.setItem('chat-app-user',JSON.stringify(data.user));
      }
      navigate("/");
    };
  }

  const handleValidation = () =>{
    const { password, confirmPassword, username, email } = values;
    if ( password !== confirmPassword){
      toast.error("Password and confirm password should be same.");
      return false;
    }else if(username.length<3){
      toast.error("Username should be greater than 3 characters.");
      return false;
    }else if(password.length<8){
      toast.error("Password should be equal or greater than 8 characters.");
      return false;
    }else if(email===""){
      toast.error("Email is required.");
    }else{
      return true;
    }
  }

  return (
    <>
      <FormContainer>
        <div className='form-box'>
          <div className='brand'>
            <img src={purple_ballon} alt='logo'/>
            <h1>Simon</h1>
          </div>
          <form onSubmit={(e)=>handleSumbit(e)}>
            <input type='text' placeholder='Username' name='username' onChange={(e)=> handleChange(e)} />
            <input type='email' placeholder='Email' name='email' onChange={(e)=> handleChange(e)} />
            <input type='password' placeholder='Password' name='password' onChange={(e)=> handleChange(e)} />
            <input type='password' placeholder='Confirm Password' name='confirmPassword' onChange={(e)=> handleChange(e)} />
            <button type='submit'>Create User</button>
            <span>already have an account ? <Link to='/login'>Login</Link></span>
          </form>
        </div>
      </FormContainer>
      <ToastContainer/>
    </>
  )
}

export default Register