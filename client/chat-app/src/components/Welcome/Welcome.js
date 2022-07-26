import React from 'react';
import styled from 'styled-components';

const colorPurple = '#8a66ff';
const Container = styled.div`
    width:100%;
    height: calc( 100% - 15% - 3rem );
    display:flex;
    flex-direction:column;
    gap:1rem;
    justify-content:center;
    align-items:center;
    h1{
        font-size: clamp(2rem,8vw,4rem);
    }
    span {
        color:${colorPurple};
    }
    p{
        font-size: clamp(1rem,4vw,1.5rem);
    }
`;
const Welcome = ({ currentUser }) => {
    return (
        <Container>
            <h1>Welcome, <span className="username">{currentUser.username}!</span></h1>
            <p>Please select a chat to Start Messaging.</p>
        </Container>
    )
}

export default Welcome;