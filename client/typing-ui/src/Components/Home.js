import React, { useState, useContext, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from './Navbar';
import Context from '../Context/Context';

const Home = () => {
    const [userName, setUserName] = useState();
    const [response, setResponse] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const context = useContext(Context);
    const usernameHandler = event => {
        setUserName(event.target.value);
    }
    const validateHandler = async (event) => {
        //match otp sent and the one user entered in the input box
        //return the state of matching
        await axios.post("http://localhost:3001/api/insert/user/verify/email", {email: userName, verifycode: event.target.value})
        .then(res => { 
            console.log(res.data.loggedIn);
            setIsAuthenticated(res.data.loggedIn);
            context.isLoggedIn = true;
            if(context.isLoggedIn === true){
                navigate('/typing-test', {replace: true});
            }
        })
    }
    const validateCaptcha = (value) => {
        console.log('Captcha value:', value);
        if(value != null){
            //post data
            axios.post("http://localhost:3001/api/insert/user", { email: userName })
            .then(res =>{
                if(res.status === 200){
                    console.log(res.status);
                }else{
                    navigate('*', {replace: true});
                }
                console.log(res.data);
            })
            console.log("form submitted");
            axios.post("http://localhost:3001/api/insert/user/verify", { email: userName })
                    .then(res =>{
                        if(res.status === 200){
                            console.log(res.status)
                        }else{
                            navigate('*', {replace: true});
                        }
                        console.log(res.data);
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
        <div className='bg-theme' style={{"height": "91vh"}}>
            <Navbar/>
            <div className='container d-flex flex-column align-items-center justify-content-center'>
                <h1>Typing Test</h1>
                <p>Test your typing score today!</p>
                <div className='intro-body'>
                    Typing board image here
                </div>
                <div>
                    <h2>Take the Test today!</h2>
                    <form>
                        <input type="email" id="username" className="form-control my-3 py-3 px-3" placeholder="Enter your email address" style={{"minWidth": "340px"}} onChange={usernameHandler}></input>
                        <input type="text" id="userotp" className="form-control my-3 py-3 px-3" placeholder="Enter OTP sent to your email" style={{"minWidth": "340px"}} onChange={validateHandler}/>
                        <div className="App">
                            <ReCAPTCHA
                                sitekey="6Lf3KbQeAAAAAHXlYdJ315hoNAQm5UsjmBsXzfuN"
                                onChange={validateCaptcha}
                                onErrored={()=>{alert("Wrong Captacha! Retry Again")}}
                            />
                        </div>
                        <button type='submit' className='px-5 my-3 d-block mx-auto py-2 btn btn-theme-secondary text-white h3'>Go to Test</button>
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default Home;