import { getCookie, decodeJwt, checkIfImgUrl, refreshPage } from './utils';
import { SERVER_HOST } from './global-config';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef } from "react"
import Box from "@material-ui/core/Box"
import { Card } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

export function sendMessageSticker(img, chatId) {
    var url = `${SERVER_HOST}/post`;
    const token = getCookie("Authorization");
    const user = decodeJwt(token);
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${img}`,
            name: `${user.userName}`,
            pfpUrl: `${user.pfpUrl}`,
            chatId: chatId
        })
    })
}

export function sendMessage(messageField, chatId) {
    var url = `${SERVER_HOST}/post`;
    const token = getCookie("Authorization");
    const user = decodeJwt(token);
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${messageField().value}`,
            name: `${user.userName}`,
            pfpUrl: `${user.pfpUrl}`,
            chatId: chatId
        })
    })
}


function setUrl(url) {
    return checkIfImgUrl(url) != null ? url : 'https://lh3.googleusercontent.com/AuX5Ic1NvfguxoqCJnOweI5apXm4y4e20zOENwbRMHewA7nkTibWhTRF8WqNtyBfbLo=w300';
}

const messageCard = message => (
    <Card className='message-card'>
        <div className='column-container message-card-profile'>
            <img width={70} className='userImage' src={setUrl(message.pfpUrl)}></img>
            <Button onClick={refreshPage} component={Link} to={"?chatId=" + message.userId} gutterBottom>
                <Typography sx={{ fontSize: 12 }}> private message ⥂ </Typography>
            </Button>
        </div>
        <div className='column-container'>
            <div className='row-container'>
                <Typography className='message-header-label'>
                    {message.name || 'unnamed'}
                </Typography>
                <Typography className='message-header-label' sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {message.time}
                </Typography>
            </div>
            <Typography className='content-label' variant="body2">
                {checkIfImgUrl(message.content) ? (<img height={100} src={message.content} />) : message.content}
            </Typography>
        </div>
    </Card>
);

export const Messages = ({ messages }) => {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    return (
        <Box id='chat' className='scrollable-chat'>
            {messages.map(d => messageCard(d))}
            <div id='chatEnd' style={{ float: "left", clear: "both" }}
                ref={messagesEndRef}>
            </div>
        </Box>
    );
};