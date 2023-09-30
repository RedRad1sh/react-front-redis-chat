import Typography from '@mui/material/Typography';
import React, { useEffect, useState, useRef } from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"
import logo from '../logo.png';
import { useNavigate } from 'react-router-dom';
import { FormControl } from '@material-ui/core';
import { setCookie } from './utils';
import { Link } from '@mui/material';

export const RegisterForm = () => {
    const navigate = useNavigate();
    const state = { user: null, error: null };
    const nameField = () => document.getElementById('nameField');
    const imgUrlField = () => document.getElementById('imgUrlField');
    const passwordField = () => document.getElementById('passwordField');

    const navigateChat = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: nameField().value, pfpUrl: imgUrlField().value, password: passwordField().value })
        };

        fetch('http://localhost:9092/token/register', requestOptions)
            .then(response => {
                if (response.status === 200) {
                    console.log("Success Authorization");
                    setCookie("Authorization", response.headers.get("Authorization"));
                    navigate('/chat');
                } else {
                    console.log("Failure Authorization")
                }
            });

        // let cookieUserName = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // console.log(cookieUserName);
        // if (cookieUserName.length === 0) {
        //     const encodedString = btoa(`${nameField().value};${imgUrlField().value}`);
        //     setCookie("token", encodedString, 604800);
        // }
        // navigate('/chat');
    };

    return (
        <Box>
            <FormControl className='login-container'>
                <Typography>Welcome! Type your user data below!</Typography>
                <div className="App-logo">
                    <img src={logo} alt="logo" />
                </div>
                <TextField required id='imgUrlField' label='Image Url' className='login-field'></TextField>
                <TextField required id='nameField' label='User Name' className='login-field'></TextField>
                <TextField required id='passwordField' type='password' required label='Password' className='login-field'></TextField>
                <Button type='submit' onClick={navigateChat} className='login-field'>Register</Button>
                <Link underline='hover' href="/login" color="inherit" variant="body2">I've already have an account...</Link>
            </FormControl>
        </Box>
    )
} 