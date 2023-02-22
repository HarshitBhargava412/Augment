import React, { useState, useEffect } from 'react';

function SignUp() {

    async function onSignUpSubmit(event) {
        event.preventDefault();
        var myHeaders = new Headers();
        // myHeaders.append( "Authorization", "Basic b0VjVmxGVzZZNU0yUUhhLXVLcEw1YnV0M0NCSFkxTURhTFZwRGRNeHNhRTo=" );
        myHeaders.append( "Content-Type", "application/json" );

        var raw = JSON.stringify( {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value, 
            phone: event.target.phone.value,
            role: 1
        } );

        var requestOptions = {
            headers: myHeaders,
            method: 'POST',
            body: raw
        };
        
        await fetch("http://localhost:4000/users/signup", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if(data.status === 201) {
                document.cookie = "token="+data.token+";path=/";
                document.querySelector(".success-message").style.display = "block";
                setTimeout(() => {
                    window.location.href = "/notes";
                }, 1500);
            } else if(data.status === 400) {
                document.querySelector(".exist-error").style.display = "block";
                setTimeout(() => {
                    document.querySelector(".exist-error").style.display = "none";
                }, 1500);
            }
        })

    }

    return (
        <div className='login-body'>
            <div className="login">
                <h1>Sign Up</h1>
                <form onSubmit={event => onSignUpSubmit(event)}>
                    <input type="name" name='name' className='login_name' placeholder="Enter Your Name" autoFocus required />
                    <input type="email" name='email' className='login_email' placeholder="Enter Your Email" required />
                    <input type="password" name='password' className='login_password' placeholder="Enter Password" required />
                    <input type="tel" name='phone' className='login_phone' placeholder="Enter Phone" required />
                    <span style={{color: "green", display: "none"}} className='success-message'>Successfully Signed Up.</span>
                    <span style={{color: "red", display: "none"}} className='exist-error'>User already exist. Kindly LogIn</span>
                    <button type="submit" className="btn btn-primary btn-block btn-large email-button code-button">Sign Up</button>
                    <span onClick={event => {
                        window.location.href = "/";
                    }} style={{color: "white", cursor: "pointer"}}>Already have an Account? <span>Click Here</span></span>
                </form>
            </div>
        </div>
    )
}

export default SignUp