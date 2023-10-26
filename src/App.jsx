import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { CSSTransition } from 'react-transition-group';
import Axios from 'axios';
import './App.css';
import CreateEntry from './components/createEntry';
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
  };

  const mainReducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
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
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <FlashMessages messages={state.flashMessages} /> */}
          <HeaderWrapper />
          <Routes>
            {/* <Route path='/profile/:username/*' element={<Profile />} /> */}
            <Route path='/' element={state.loggedIn ? <MedList /> : <HomeGuest />} />
            <Route path='/create-entry' element={<CreateEntry />} />
            {/* <Route path='/login' element={<Login />} /> */}
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;
