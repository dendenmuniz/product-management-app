import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="d-bg-base-100">
        <header className="d-bg-base-200 d-text-base-900 d-py-4">
          <div className="d-flex d-items-center d-justify-between d-container">
            <img src={reactLogo} alt="React Logo" className="d-w-16" />
            <h1 className="d-text-lg">Welcome to Vite + React</h1>
            <img src={viteLogo} alt="Vite Logo" className="d-w-16" />
          </div>
        </header>
        <main className="d-container d-py-8">
          <h2 className="d-text-xl">Counter</h2>
          <p className="d-text-lg">The count is: {count}</p>
          <button className="d-btn d-btn-primary" onClick={() => setCount((count) => count + 1)}>
            Increment
          </button>
        </main>
      </div>
    </>
  );
}

export default App;
