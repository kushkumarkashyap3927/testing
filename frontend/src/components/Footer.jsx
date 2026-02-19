import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Anvaya.Ai — Built for deterministic BRD synthesis.</div>
    </footer>
  );
}
