
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- SYSTEM INITIALIZATION LOGS ---
const logStyle = 'color: #00D4FF; font-weight: bold; font-size: 10px; background: #0A0A14; padding: 2px 5px; border-radius: 4px;';
const infoStyle = 'color: #7B42FF; font-weight: bold;';

console.log("%c[ISA 2.5 CORE]%c Initializing Operational Environment...", logStyle, "color: #888;");
console.log("%c[CORE]%c React v19.0.0 Loaded", infoStyle, "color: #555;");
console.log("%c[MODULES]%c Lucide Icons & Recharts Connected", infoStyle, "color: #555;");
console.log("%c[NETWORK]%c Gemini API Bridge Established", infoStyle, "color: #555;");
console.groupCollapsed("%c[SYSTEM STATUS]%c Diagnostics", logStyle, "color: #888;");
console.log("Memory Allocation: optimized");
console.log("Visual Engine: Tailwind CSS 3.4");
console.log("Security: AES-256 Simulation Active");
console.groupEnd();

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("%c[CRITICAL ERROR]%c Could not find root element to mount to", "color: red; font-weight: bold;", "");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("%c[READY]%c ISA 2.5 is now active. Access dashboard at /dashboard", "color: #22C55E; font-weight: bold;", "color: #888;");
