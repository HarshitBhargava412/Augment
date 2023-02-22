import React, { useState, useEffect } from 'react';
import './Login.css';

function Login() {

    async function onSignInSubmit(event) {
        event.preventDefault();
        var myHeaders = new Headers();
        // myHeaders.append( "Authorization", "Basic b0VjVmxGVzZZNU0yUUhhLXVLcEw1YnV0M0NCSFkxTURhTFZwRGRNeHNhRTo=" );
        myHeaders.append( "Content-Type", "application/json" );

        var raw = JSON.stringify( {
            email: event.target.email.value,
            password: event.target.password.value
        } );

        var requestOptions = {
            headers: myHeaders,
            method: 'POST',
            body: raw
        };
        
        await fetch("http://localhost:4000/users/signin", requestOptions)
        .then(response => response.json())
        .then((data) => {
            if(data.status === 200) {
                document.cookie = "token="+data.token+";path=/";
                document.querySelector(".success-message").style.display = "block";
                setTimeout(() => {
                    window.location.href = "/notes";
                }, 1500);
            } else if(data.status === 404) {
                document.querySelector(".not-found-error").style.display = "block";
                setTimeout(() => {
                    window.location.href = "/signup";
                }, 1500);
            } else if(data.status === 400) {
                document.querySelector(".credential-error").style.display = "block";
                document.cookie = "token=''";
                setTimeout(() => {
                    document.querySelector(".credential-error").style.display = "none";
                }, 1500);
            }
        });
    }

    return (
        <div className='login-body'>
            <div className="login">
                <h1>Sign In</h1>
                <form onSubmit={event => onSignInSubmit(event)}>
                    <input type="email" name='email' className='login_email' placeholder="Enter Your Email" autoFocus required />
                    <input type="password" name='password' className='login_password' placeholder="Enter Password" required />
                    <span style={{color: "green", display: "none"}} className='success-message'>Successfully Logged In.</span>
                    <span style={{color: "red", display: "none"}} className='credential-error'>Invalid Credentials.</span>
                    <span style={{color: "red", display: "none"}} className='not-found-error'>User doesn't exist. Kindly Sign Up First.</span>
                    <button type="submit" className="btn btn-primary btn-block btn-large email-button code-button">Sign In</button>
                    <span onClick={event => {
                        window.location.href = "/signup";
                    }} style={{color: "white", cursor: "pointer"}}>Don't have an Account? <span>Click Here</span></span>
                </form>
            </div>
        </div>
    )
}

export default Login