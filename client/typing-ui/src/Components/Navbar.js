import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context/Context';

const Navbar = () => {
    const context = useContext(Context);
    const navigate = useNavigate();
    const statusHandler = () => {
        if(context.isLoggedIn === true){
            context.isLoggedIn = false;
        }else{
            return navigate("/", {replace: true});
        }
    }
    return ( 
        <nav className='navbar bg-theme-secondary px-5'>
            <h1 className='h2 fw-bold text-white'>Typing Test</h1>
            <div className='ms-auto'>
                <button className='btn-default px-4 py-2 text-dark' onClick={statusHandler}>{context.isLoggedIn === true ? 'Logout' : 'Login'}</button>
            </div>
        </nav>
     );
}
 
export default Navbar;