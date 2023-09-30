
import Card from "@material-ui/core/Card"
import Typography from '@mui/material/Typography';
import React, { useEffect, useState, useRef } from "react"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import { useNavigate } from "react-router-dom";
import { getCookie, stickerChooser, checkIfImgUrl } from './utils';
import { Select, MenuItem } from "@material-ui/core";
import { sendMessage, sendMessageSticker } from "./messaging";
import { server_host } from "./global-config";

function setUrl(url) {
    return checkIfImgUrl(url) != null ? url : 'https://images.pngnice.com/download/2007/User-Account-Person-PNG-File.png';
}

const messageCard = message => (
    <Card className='message-card'>
        <div className='column-container message-card-profile'>
            <img width={70} className='userImage' src={setUrl(message.pfpUrl)}></img>
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

export function ChatBox() {
    const messageField = () => document.getElementById('messageField');
    const chatEnd = () => document.getElementById('chatEnd');
    const navigate = useNavigate();
    const [messages, setMessages] = useState([])

    const updateMessages = (data) => {
        const parsedData = JSON.parse(data);
        setMessages(oldArray => [...oldArray, parsedData]);
        chatEnd().scrollIntoView({
            block: "nearest",
            inline: "center",
            behavior: "smooth",
            alignToTop: false
        })
    }

    const sendMsg = () => {
        sendMessage(messageField);
        messageField().value = ""
    }

    useEffect(() => {
        const token = getCookie("Authorization");
        if (token === null) {
            navigate("/")
        }

        const eventSource = new EventSource(`${server_host}/chatAlive?authToken=${token}`, {
            headers: {
                'Authorization': token
            }
        });
        eventSource.onmessage = (e) => updateMessages(e.data);
        return () => {
            eventSource.close();
        };
    }, []);

    const handleEnterDown = event => {
        if (event.key === "Enter") {
            sendMsg();
        }
    };

    const handleChange = event => {
        sendMessageSticker(stickerChooser(event.target.value));
        event.target.value = 0;
    }

    return (
        <Box>
            <Messages messages={messages} />
            <Box className='row-container send-controls'>
                <TextField label="Message" onKeyDown={handleEnterDown} id='messageField' className='textfield messageField'></TextField>
                <Select
                    labelId="sticker-select-label"
                    id="stickers-select"
                    label="Stickers"
                    value="0"
                    onChange={handleChange}
                >
                    <MenuItem value={0} disabled>Stickers</MenuItem>
                    <MenuItem value={1}><img height="100" src="https://cdn140.picsart.com/279266365020211.png" /></MenuItem>
                    <MenuItem value={2}><img height="100" src="https://cdn141.picsart.com/317144785180211.png" /></MenuItem>
                    <MenuItem value={3}><img height="100" src="https://i.pinimg.com/originals/7a/04/20/7a0420e32946f4ee78c19da768e37892.png" /></MenuItem>
                </Select>
                <Button onClick={sendMsg} className='send-button' align="center" color="primary" variant="h2">
                    SEND MESSAGE
                </Button>
            </Box>
        </Box>
    )
}