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
import { DBProvider } from "./context/dbContext.jsx";
import { isSameDay, parseISO } from "date-fns";

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("medsTrackerToken")),
    // flashMessages: [],

    token: localStorage.getItem("medsTrackerToken"),
    userId: localStorage.getItem("medsTrackerUserId"),
    today: localStorage.getItem("medsTrackerToday"), // use case for useLocalStorage?
    schedule: [],
  };

  const mainReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.token = action.data.token;
        draft.userId = action.data.userId;
        draft.today = new Date().toDateString();
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "updateSchedule":
        draft.schedule = action.data;
        return;
      case "updateToday":
        draft.today = action.data;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(mainReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("medsTrackerToken", state.token);
      localStorage.setItem("medsTrackerUserId", state.userId);
      localStorage.setItem("medsTrackerToday", state.today);
    } else {
      localStorage.removeItem("medsTrackerToken");
      localStorage.removeItem("medsTrackerUserId");
      localStorage.removeItem("medsTrackerToday");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    //midnight date change detecting
    const interval = setInterval(() => {
      if (!state.loggedIn) return;
      const currentDay = new Date();
      // if (!isSameDay(new Date(parseInt(state.today)), new Date(currentDay))) {
      if (!isSameDay(new Date(state.today), currentDay)) {
        console.log("diff day detectected");
        dispatch({ type: "updateToday", data: currentDay.toDateString() });
        localStorage.setItem("medsTrackerToday", currentDay.toDateString());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("schedule==>", state.schedule);
  }, [state.schedule]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-50">
      <div className="m-3 min-w-[80%] space-y-10 rounded-3xl bg-white p-6 shadow-2xl">
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <DBProvider>
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
            </DBProvider>
          </DispatchContext.Provider>
        </StateContext.Provider>
      </div>
    </div>
  );
};

export default App;
