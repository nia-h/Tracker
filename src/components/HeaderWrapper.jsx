import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import { DispatchContext, StateContext } from '../Contexts';

function HeaderWrapper(props) {
  const mainState = useContext(StateContext);

  return (
    <header className='header-bar bg-primary mb-3'>
      <div className='container d-flex flex-column flex-md-row align-items-center p-3'>
        <h4 className='my-0 mr-md-auto font-weight-normal'>
          <Link to='/' className='text-white'>
            My schedule
          </Link>
        </h4>
        {mainState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
}

export default HeaderWrapper;
