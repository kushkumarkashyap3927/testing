import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white/50 py-4 text-center text-sm text-gray-600">
      <div>© {new Date().getFullYear()} Anvaya.Ai — Built for deterministic BRD synthesis.</div>
    </footer>
  );
}
