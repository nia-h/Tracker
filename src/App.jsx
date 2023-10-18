import { useState } from 'react';

import './App.css';
import CreateEntry from './components/createEntry';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CreateEntry />
    </>
  );
}

export default App;
