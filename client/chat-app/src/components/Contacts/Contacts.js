
import React, {useState, useEffect} from 'react'
import { LogOut } from '../../components';
import styled from 'styled-components';
import purple_ballon from '../../assets/images/purple_ballon.png';

const colorPurple = '#8a66ff';
const Container = styled.div`
  position:relative;
  top:0;
  display: flex;
  flex-direction:column;
  width:100%;
  height:30%;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 2rem 2rem 0px 0px;

  .status-box{
    position: relative;
    display:flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
  }
  .user-box{
    display:flex;
    flex-direction:row;
    align-items: center;
    gap:1rem;
    ${'' /* width:100%;
    .avatar{
      width:100%;
    } */}
    ${'' /* .username{
      display:none;
    } */}
  }
  .brand {
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items : center;
    img{
      width:100%;
      height:4rem;
    }
  }
  .contacts {
    display:flex;
    flex-direction:row;
    flex-wrap:nowrap;
    gap:1rem;
    overflowX:auto;
    .avatar {
      border: 0.3rem solid transparent;
      border-radius: 15rem;
      padding: 0.1rem 0 0 0;
      img{
        width:100%;
        height:3.5rem;
      }
    }
    .selected{
        border:0.3rem solid #8a66ff;
    }
    .username{
        text-align:center;
    }

  }
  @media only screen and (min-width:1250px){
    width:30%;
    height:100%;
    padding: 0.5rem 1rem 2rem 1rem;
    border-radius: 2rem 0px 0px 2rem;
    .status-box{
      padding: 1rem 0 1rem 0;
      flex-direction:column;
      .brand{
        img{
          width:auto;
          height:4rem;
        }
      }
    }
    .user-box{
      margin:auto;
    }
    .contacts{
      flex-direction:column;
      gap:2rem;
      overflow:auto;
      .avatar{
        border: 0.5rem solid transparent;
        padding:0.3rem;
        border-radius: 9rem;
        transition: 0.5s ease-in-out;
        img{
          width:100%;
          height: 6.5rem;
        }
      }
      .selected{
        background:${colorPurple};
        border: 0.5rem solid ${colorPurple};
      }
    }
  }
`;
const Contacts = ({contacts, currentUser, changeChat}) => {

  const [ currentUserName, setCurrentUserName ] = useState(undefined);
  const [ currentUserImage, setCurrentUserImage ] = useState(undefined);
  const [ currentSelected, setCurrentSelected ] = useState(undefined);

  useEffect(()=>{
    if(currentUser){
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  },[currentUser]);

  const changeCurrentChat = async (index, contact) =>{
    setCurrentSelected(index);
    changeChat(contact);
    console.log(contact);
  };
  return ( 
    currentUserImage && currentUserName && (
      <Container>
        <div className='status-box'>
          <div className="brand">
            <img src={purple_ballon} alt="logo"/>
            <h3>Simon</h3>
          </div>
          <div className='user-box'>
            <div className='current-user'>
              <div className='avatar'>
                <img 
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt='User_Image'/>
              </div>
              <div className='username'>
                <h3>{currentUserName}</h3>
              </div>
            </div>
            <LogOut/>
          </div>
        </div>
        <div className='contacts'>
        {/* contacts?.map 으로 first asking if array existed  */}
        {
          contacts?.map((contact, index) =>{
            return (
              <div className='contact' key={index} onClick={()=>changeCurrentChat(index,contact)}>
                <div className={`avatar ${currentSelected === index ? "selected" : "" }`}>
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt='avatar' />
                </div>
                <div className='username'>
                  <h3>{contact.username}</h3>
                </div>
              </div>
            )
          })
        }
        {contacts===[] && <h1>TThere is no contact in list.</h1>}
        </div>

      </Container>
    )
  );
}

export default Contacts;