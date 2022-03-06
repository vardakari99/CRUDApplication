import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tester from './Components/Tester';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './Components/Home';
import Context from './Context/Context';
// import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
    <Context.Provider value={{isLoggedIn: false}}>
      <Routes>
        <Route exact element={<Home/>} path="/"/>
        <Route element={<Tester/>} path="/typing-test"/>
        <Route element={<Home/>} path="*"/>
      </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
