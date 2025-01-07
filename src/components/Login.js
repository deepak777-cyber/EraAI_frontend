import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//import logoImage from '../images/download.jpg';
import { useAuth } from '../providers/AuthProvider' ; // Adjust the import path as necessary
import config from '../configs/config'; // Adjust the import path as necessary
import { useMsal } from "@azure/msal-react"; // Import useMsal hook for authentication
import { msalConfig } from "../configs/authConfig"; // Import loginRequest from your msalConfig
import './styles/Login.css'// Make sure to create this CSS file

//import { container, formContainer, registerButton,button,input,logo,facebookButtonStyle,googleButtonStyle,socialButtonStyle } from '../styles/initialStyles';

function Login() {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleLogin = async () => {
        try {
            const loginResponse = await instance.loginPopup();
            console.log("Login successful:", loginResponse.account);
            if (loginResponse) {
                const response = await fetch(`${config.API_BASE_URL}/loginOffice`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: loginResponse.account.username })
                });

                if (response.ok) {
                    const data = await response.json();
                    login(data); // Pass user data to login function
                    navigate('/home');
                } else {
                    console.error('Failed to fetch user data');
                }
            }
            
            // Handle login success here
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
     return (
        <div className='login-container'>
            <div className='image-container'> 
                <img src='https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?cs=srgb&dl=pexels-therato-3408744.jpg&fm=jpg' alt="Excavate Research" />
                </div>
                <div className='button-container'> 
                        <button className='button' onClick={handleLogin} >
          Login
        </button>
        </div>
                </div>

    );
}

export default Login;
