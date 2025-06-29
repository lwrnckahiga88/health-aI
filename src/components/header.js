
import React from 'react';
import '../styles.css';

const Header = () => {
  return (
    <header className="header">
      <h1>HomeHealth AI Chat</h1>
      <nav>
        <ul className="nav-list">
          <li><a href="/" aria-label="Go to Home Page">Home</a></li>
          <li><a href="/about" aria-label="Learn more About Us">About</a></li>
          <li><a href="/contact" aria-label="Contact Us">Contact</a></li>
        </ul>               
      </nav>                                                      
    </header>
  );
};

export default Header;  // ✅ Properly placed
