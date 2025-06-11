import React from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import './styles.css';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <Chat />
    </div>
  );
};

export default App;  // ✅ Clean export