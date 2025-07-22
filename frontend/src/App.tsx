import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import MainScreen from './components/MainScreen';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './context/AuthContext';


// Por si acaso, para cada nueva ventana y para la coreccta navegación se debe importar aquí 
// y agrear tanto el path como el elemento en <Routes>

//            - Kevin xd


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<MainScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;




