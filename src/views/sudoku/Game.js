import React, { useRef, useEffect } from 'react'
import gameFactory from '../../modules/SudokuSolver.js';

const App = () => {

  const gameRef = useRef(null);

  useEffect(() => {
    const size = Math.min(window.innerWidth, 600);
    const app = gameFactory(size, gameRef.current);
    return () => app.destroy();
  }, []);

  return (
    <div className="container flex mt-24 mb-24 mx-auto">
      <div className="mx-auto align-center" ref={gameRef} />
    </div>
  )
}

export default App;