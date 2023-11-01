import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { CSSTransition } from 'react-transition-group';
import Axios from 'axios';
import './App.css';
import HomeGuest from './components/Homeguest';
// import Login from './components/Login';
import MedList from './components/medList';
import HeaderWrapper from './components/HeaderWrapper';

import { StateContext, DispatchContext } from './Contexts';

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('medsTrackerToken')),
    // flashMessages: [],
    user: {
      token: localStorage.getItem('medsTrackerToken'),
      userId: localStorage.getItem('medsTrackerUserId'),
    },
    profile: {},
  };

  const mainReducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        draft.profile = action.data.profile;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'addToSchedule':
        draft.profile = action.data;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(mainReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('medsTrackerToken', state.user.token);
      localStorage.setItem('medsTrackerUserId', state.user.userId);
    } else {
      localStorage.removeItem('medsTrackerToken');
      localStorage.removeItem('medsTrackerUserId');
    }
  }, [state.loggedIn]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-cyan-50'>
      <div className='bg-white min-w-[80%] p-6 m-3 space-y-10 shadow-2xl rounded-3xl'>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <BrowserRouter>
              <HeaderWrapper />
              <Routes>
                {/* <Route path='/profile/:username/*' element={<Profile />} />  */}
                <Route
                  path='/'
                  element={state.loggedIn ? <MedList /> : <HomeGuest />}
                />
              </Routes>
            </BrowserRouter>
          </DispatchContext.Provider>
        </StateContext.Provider>
      </div>
    </div>
  );
};

export default App;
