import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { CSSTransition } from 'react-transition-group';
import Axios from "axios";
import "./App.css";
import HomeGuest from "./components/Homeguest";
// import Login from './components/Login';
import MedList from "./components/medList.jsx";
import HeaderWrapper from "./components/HeaderWrapper";

import { StateContext, DispatchContext } from "./Contexts";

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("medsTrackerToken")),
    // flashMessages: [],
    user: {
      token: localStorage.getItem("medsTrackerToken"),
      userId: localStorage.getItem("medsTrackerUserId"),
    },
    // profile: {},
    schedule: [],
    today: Date.now(),
  };

  const mainReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.token = action.data.token;
        draft.userId = action.data.userId;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "addToSchedule":
        draft.profile = action.data;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(mainReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("medsTrackerToken", state.token);
      localStorage.setItem("medsTrackerUserId", state.userId);
    } else {
      localStorage.removeItem("medsTrackerToken");
      localStorage.removeItem("medsTrackerUserId");
    }
  }, [state.loggedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-50">
      <div className="m-3 min-w-[80%] space-y-10 rounded-3xl bg-white p-6 shadow-2xl">
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <BrowserRouter>
              <HeaderWrapper />
              <Routes>
                {/* <Route path='/profile/:username/*' element={<Profile />} />  */}
                <Route
                  path="/"
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
