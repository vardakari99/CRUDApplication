import { createContext } from 'react';

const Context = createContext({
    isLoggedIn: false,
    user: ''
});

export default Context 