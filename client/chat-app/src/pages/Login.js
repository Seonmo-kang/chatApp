import React, { useState,useEffect } from 'react'
import {Link , useNavigate} from "react-router-dom";
import styled from 'styled-components';
import axios from "axios";

import purple_ballon from '../assets/images/purple_ballon.png';

import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from '../utils/APIRoutes';

const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #313444;
  .form-box{
    background: rgb(236, 236, 236);
    border-radius: 2rem;
    box-shadow: 0 0 10px rgba(236, 236, 236,0.4), 0 0 40px rgba(236, 236, 236,0.4), 0 0 80px rgba(236, 236, 236,0.4);
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
        color:#8a66ff;
        font-weight: bold;
        transition: all 0.5s;
      }
    }
  }
`;

const Login = () => {
const [values, setValues] = useState({
email:"",
password:"",
})
const navigate = useNavigate();   // naviage to another url.

// redirect to "/" if localStorage has a chat-app-user
useEffect(() => {
    if(localStorage.getItem('chat-app-user')){
        navigate('/');
    }   
},[]);

const handleChange = e =>{
setValues({...values,[e.target.name]: e.target.value });
}

const handleSumbit = async (e) =>{
e.preventDefault();
if(handleValidation()){
    const { password, email } = values;
    console.log("in validation",loginRoute);
    const { data } = await axios.post(loginRoute,{
    email,
    password,
    });
    if( data.status===false ){
    toast.error(data.msg);
    }
    if( data.status===true ){
    localStorage.setItem('chat-app-user',JSON.stringify(data.user));
    navigate("/");
    }
};
}

const handleValidation = () =>{
const { password, email } = values;
if( email.length === "" || password.length === ""){
    toast.error(" Email and Password are required.");
    return false;
}
else{
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
        <input type='email' placeholder='Email' name='email' onChange={(e)=> handleChange(e)} />
        <input type='password' placeholder='Password' name='password' onChange={(e)=> handleChange(e)} />
        <button type='submit'>Login</button>
        <span>Need to create an account ? <Link to='/register'>Create Account</Link></span>
        </form>
    </div>
    </FormContainer>
    <ToastContainer/>
</>
)
}

export default Login;