import React, { useState, useContext, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from './Navbar';
import Context from '../Context/Context';
import $ from 'jquery';

const Home = () => {
    const [userName, setUserName] = useState();
    const [response, setResponse] = useState();
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidOtp, setInvalidOtp] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const context = useContext(Context);
    const usernameHandler = event => {
        if(event.target.value !== ''){
            //regex validation to not have any special characters except @
            const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(regEx.test(event.target.value)){
                console.log("email is valid");
                $("#username").prop("readonly", true);
                setUserName(event.target.value);
                $("#captcha").removeClass("d-none");
                $("#username").removeClass("is-invalid");
            }else{
                //send error message
                $("#username").addClass("is-invalid");
                $("#captcha").addClass("d-none");
                setInvalidEmail(true);
            }
        }else{
            setInvalidEmail(false);
        }
    }
    const validateHandler = (event) => {
        //match otp sent and the one user entered in the input box
        //return the state of matching
        if(event.target.value != null){
            const regExp = /^[A-Za-z0-9]+$/;
            if(regExp.test(event.target.value)){
                axios.post("http://localhost:3001/api/insert/user/verify/email", {email: userName, verifycode: event.target.value})
                .then(res => { 
                    if(res.status === 200){
                        console.log(res.status);
                        console.log(res.data.data.loggedIn);
                        context.isLoggedIn = true;
                        setIsAuthenticated(true);
                        context.user = userName;
                        navigate('/typing-test', {replace: true});
                        $('#go-to-test-btn').prop('disabled', !isAuthenticated);
                    }else{
                        navigate('/', {replace: true});
                    }
                    
                })
                setInvalidOtp(false);
            }else{
                setInvalidOtp(true);
                $("#userotp").addClass("is-invalid");
            }
        }else{
            setInvalidOtp(false);
            $("#userotp").removeClass("is-invalid");
        }
    }
    const validateCaptcha = (value) => {
        //regex to check to not have any special characters
        if(value != null){
            //post data
            axios.post("http://localhost:3001/api/insert/user", { email: userName })
            .then(res =>{
                if(res.status === 200){
                    console.log("form submitted");
                }else{
                    navigate('*', {replace: true});
                }
            })
            axios.post("http://localhost:3001/api/insert/user/verify", { email: userName })
                    .then(res =>{
                        if(res.status === 200){
                            $("#emailSent").removeClass("d-none");
                            $("#userotp").removeClass("d-none");
                        }else{
                            navigate('*', {replace: true});
                        }
                    })
        }else{
            setIsAuthenticated(false);
        }
      }
      useEffect(()=>{
        if(response){
          console.log(response);
        }
    },[response, setResponse])

  return ( 
        <div>
            <Navbar/>
            <div className='w-100 d-flex' style={{height: "92.3vh"}}>
               <div className='col-sm-6 d-flex flex-column align-items-center justify-content-center'>
                   <div className='task-card py-3 px-5'>
                        <h3 className='text-theme fw-bold py-4'>Login/Signup to Begin</h3>
                        <form className='needs-validation'>
                            <input type="email" id="username" className="form-control my-4 py-3 px-3" placeholder="Enter your email address" style={{"minWidth": "340px"}} onBlur={usernameHandler} required></input>
                            {invalidEmail && <span className='error invalid-feedback'>Invalid Email Address. Check again!</span>}
                            <div id="captcha" className="App my-4 d-none">
                                <ReCAPTCHA
                                    sitekey="6Lf3KbQeAAAAAHXlYdJ315hoNAQm5UsjmBsXzfuN"
                                    onChange={validateCaptcha}
                                    onErrored={()=>{alert("Wrong Captacha! Retry Again")}}
                                />
                            </div>
                            <span id="emailSent" className='text-warning d-none'>Check your inbox for verification code.</span>
                            <input type="text" id="userotp" className="form-control d-none my-4 py-3 px-3" placeholder="Enter OTP sent to your email" style={{"minWidth": "340px"}} onChange={validateHandler}/>
                            {invalidOtp && <span className='error invalid-feedback'>Invalid Verification Code. Try again!</span>}
                            <button type='submit' disabled={true} id="go-to-test-btn" className='px-5 my-5 d-block mx-auto py-2 btn btn-theme text-white h3'>Go to Test</button>
                        </form>
                    </div>
                </div>
               <div className='col-sm-6 h-100'>
                    <img className='h-100 w-100' src="https://site.surveysparrow.com/wp-content/uploads/2020/08/How-to-type-faster-Tips-and-Tricks-to-be-a-Typing-Pro.png" />
                </div>
            </div>
        </div>
      ) 
}
export default Home;