import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://app.gaadibaazar.in/widget/chatbox/common_scripts/script.js";
    script.async = true;
    script.onload = () =>
      window.loadChat360Bot("892d1954-edaa-4336-9b53-dec7b31c2964");

    document.body.appendChild(script);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
