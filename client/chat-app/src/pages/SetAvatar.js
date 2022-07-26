import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import axios from "axios";

import purple_ballon from '../assets/images/purple_ballon.png';
import loader from '../assets/images/loader.gif';

import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from "buffer"; // For images

const formColor = 'rgb(236, 236, 236)';
const formShadow = 'rgba(236, 236, 236,0.4)';
const colorPurple = '#8a66ff';
const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    background-color : #313444;
    width:100vw;
    height:100vh;    
    .avatar-box{
        background: ${formColor};
        border-radius: 2rem;
        box-shadow: 0 0 10px ${formShadow}, 0 0 40px ${formShadow}, 0 0 80px ${formShadow};
        margin: 0 1rem;
        max-width:1000px;
    }
    .title-container{
        font-size: clamp(0.5rem,2.5vw,1.2rem);
        padding: 2em;
    }
    .avatars{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content:center;
        align-items:center;
        width:100%;
        gap: 1rem;
        padding: 1rem;

        .avatar {
            border: 0.5rem solid transparent;
            padding:0.3rem;
            border-radius: 9rem;
            transition: 0.5s ease-in-out;
            img{
                width:100%;
            }
        }
        .selected{
            border: 0.5rem solid ${colorPurple};
        }
    }
    .submit-box{
        padding : 1em;
        display:flex;
        justify-content:center;
        .submit-btn{
        border-radius: 1rem;
        padding:1em;
        background-color:${colorPurple};
        transition: 0.5s;
        font-size: clamp(0.75rem,2.5vw,1rem);
        font-weight:bold;
        }
        .submit-btn:hover{
        background-color:#87cefa;
        }
    }
    @media only screen and (max-width: 768px){
        .avatar-box{
            margin: 0;
        }
        .avatars{
            padding: 1rem 0;
            gap:0.5rem;
            .avatar{
                border: 0.3rem solid transparent;
                padding: 0.1rem 0;
            }
            .selected{
                border:0.3rem solid ${colorPurple};
            }
        }
        .submit-btn{
            font-size:.0.5rem;
        }
    }

    

`;

const SetAvatar = () => {
    const api = 'https://api.multiavatar.com/4567845'; // change this api key into express route
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError ] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const setProfilePicture = async () =>{
        if(selectedAvatar === undefined ){
            toast.error("Please select an Avatar");
        }else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            if(!user){
                toast.error("Please login first",{ autoClose: 3000, closeOnClick: true });
                const redirect_to_login = setInterval(()=>{
                    navigate("/login");
                },4000);
                redirect_to_login();
            }
            const { data }  = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image: avatars[selectedAvatar],
            });
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user",JSON.stringify(user));
                navigate("/");
            }else{
                toast.error("Error Setting avatar. Please try again.");
            }
        }
    }

    const fetchAvatars = async () =>{
        const data = [];
        for(let i=0; i<3; i++){
            const image = await axios.get(
                `${api}/${Math.floor(Math.random()*1000)}`
            ).then((result)=>{
                const buffer = new Buffer(result.data);
                data.push(buffer.toString("base64"));
            }).catch( ex =>{
                setIsError(true);
            });

        }
        setAvatars(data);
        setIsLoading(false);
    };

    useEffect( () => {
        fetchAvatars();
    },[]);
  return (
    <>
    {
        isLoading? 
            <Container>
            <img src={loader} alt="loader" className='loader' />
            { isError && 
            <>
            <h2>Please try a min later</h2>
            <p>Error : Limit reached: 10 calls/min</p>
            </>}
            </Container> 
         : 
            <Container>
                <div className='avatar-box'>
                    <div className='title-container'>
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className='avatars'>{
                        avatars.map((avatar,index)=>{
                            return(
                                <div key={index} className={`avatar ${
                                    selectedAvatar === index? "selected" : "" 
                                }`}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt='avatar'
                                        onClick={()=>setSelectedAvatar(index)}
                                    />

                                </div>
                            )
                        })
                    }
                    </div>
                    <div className='submit-box'>
                        <button className='submit-btn' onClick={setProfilePicture}>
                            Set as Profile Picture
                        </button>
                    </div>
                </div>
            </Container>
    }
    <ToastContainer/>
    </>
    
  )
}

export default SetAvatar