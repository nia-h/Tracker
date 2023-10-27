import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import { DispatchContext, StateContext } from '../Contexts';

function HeaderWrapper(props) {
  const mainState = useContext(StateContext);

  return (
    <header className=''>
      <div className='flex flex-col items-center justify-center space-x-8 space-y-3 md:flex-row md:space-y-0 md:space-x-44 md:mb-24 md:justify-end'>
        <h4 className=''>
          <Link to='/' className='text-blue-500'>
            My schedule
          </Link>
        </h4>
        {mainState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
}

export default HeaderWrapper;
