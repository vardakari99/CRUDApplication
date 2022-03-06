import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tester from './Components/Tester';
import Validate from './Components/Validate';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './Components/Home';
import Context from './Context/Context';

function App() {
  return (
    <BrowserRouter>
    <Context.Provider value={{isLoggedIn: false}}>
      <Routes>
        <Route exact element={<Home/>} path="/"/>
        <Route element={<Tester/>} path="/typing-test"/>
        <Route element={<Validate/>} path="/validate"/>
        <Route element={<Home/>} path="*"/>
      </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
