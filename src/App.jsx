import { useState } from 'react';

import './App.css';
import CreateEntry from './components/createEntry';
import HomeGuest from './components/Homeguest';
import Login from './components/login';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <CreateEntry /> */}
      <HomeGuest />
      <Login />
    </>
  );
}

export default App;
