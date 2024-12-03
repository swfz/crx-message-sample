import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const handleStart = async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id === undefined) {
      return;
    }

    chrome.tabs.sendMessage(tab.id, { command: 'Load', platform: 'zoom', tabId: tab.id }, (res) => {
      console.log('popup', res);
    });
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Messaging Sample</h1>
      <div className="card">
        <button onClick={handleStart}>
          Start
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
