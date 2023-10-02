import Card from "@material-ui/core/Card"
import { CardMedia } from "@mui/material";
import React, { useEffect, useState } from "react"
import Box from "@material-ui/core/Box"
import { useNavigate } from "react-router-dom";
import { getCookie, stickerChooser, refreshPage } from './utils';
import { Select, MenuItem, FormControl, CardContent, Button, TextField } from "@material-ui/core";
import { sendMessage, sendMessageSticker } from "./messaging";
import { SERVER_HOST } from "./global-config";
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Messages } from "./messaging";
import { decodeJwt } from "./utils";

export const ChatBox = () => {
    const messageField = () => document.getElementById('messageField');
    const chatEnd = () => document.getElementById('chatEnd');
    const navigate = useNavigate();
    const [messages, setMessages] = useState([])
    const [queryParameters] = useSearchParams()
    const [user, setUser] = useState("")

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
        sendMessage(messageField, queryParameters.get("chatId"));
        messageField().value = ""
    }

    useEffect(() => {
        const token = getCookie("Authorization");
        async function setStateUser() {
            const user = await decodeJwt(token);
            setUser(user);
            console.log(user.id)
        }
        setStateUser()

        if (token === null) {
            navigate("/")
        }
        const eventSource = new EventSource(`${SERVER_HOST}/chatAlive?authToken=${token}&chatId=${queryParameters.get("chatId")}`, {
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
        sendMessageSticker(stickerChooser(event.target.value), queryParameters.get("chatId"));
        event.target.value = 0;
    }

    return (
        <Box className="column-container main-class">
            <Box className="row-container chat-ui">
                <Messages messages={messages} />
                <Box className="room-select column-container">
                    <Button className="room-button" component={Link} onClick={refreshPage} underline='hover' to="/chat" color="inherit" variant="text">
                        <Card className="row-container room-card">
                            <CardContent>General</CardContent>
                            <CardMedia component="img" sx={{ width: 50 }}
                                image="https://cdn0.iconfinder.com/data/icons/city-elements-9/128/City_skyline-1024.png" />
                        </Card>
                    </Button >
                    <Button className="room-button" component={Link} onClick={refreshPage} underline='hover' to={"/chat?chatId=" + user.id} color="inherit" variant="text">
                        <Card className="row-container room-card">
                            <CardContent>Saved Messages</CardContent>
                            <CardMedia component="img" sx={{ width: 50 }}
                                image="https://cdn0.iconfinder.com/data/icons/city-elements-9/128/City_skyline-1024.png" />
                        </Card>
                    </Button>
                </Box>
            </Box>
            <Box className='row-container send-controls'>
                <TextField label="Message" onKeyDown={handleEnterDown} id='messageField' className='textfield messageField'></TextField>
                <FormControl className="stickers-select" variant="outlined">
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
                        <MenuItem value={4}><img height="100" src="https://c1.cprnt.com/storage/i/27/a8/18/99/ba424d20a9fc7486882c042d/38ece0eb383e1276a281107f94ad360c.png" /></MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={sendMsg} className='send-button' align="center" color="primary" variant="text">
                    SEND MESSAGE
                </Button>
            </Box>

        </Box>
    )
}