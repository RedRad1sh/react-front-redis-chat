import './App.css';
import React, { useEffect} from "react"
import { ChatBox, } from './components/chat-box';
import { RegisterForm } from './components/register-form';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes >
            <Route path="/" element={<RegisterForm></RegisterForm>}/>
            <Route path="/chat" element={<ChatBox></ChatBox>}/>
          </Routes >
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
