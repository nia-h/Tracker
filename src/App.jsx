import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { CSSTransition } from 'react-transition-group';
import Axios from "axios";
import "./App.css";
import HomeGuest from "./components/Homeguest";
// import Login from './components/Login';
import MedList from "./components/MedList.jsx";
import HeaderWrapper from "./components/HeaderWrapper";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;

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
    socialUserObj: null,
    socialId: null,
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
      case "socialUser":
        draft.socialUserObj = action.data;
        draft.today = new Date().toDateString();
        draft.socialId = action.data.username + action.data.id;
        return;
      case "socialUser_id":
        draft.userId = action.data;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(mainReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getUser = () => {
      fetch(
        "http://localhost:8081/auth/login/success",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        },
        { signal },
      )
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          // setUser(resObject.user);
          dispatch({ type: "socialUser", data: resObject.user });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (!state.socialUserObj) getUser();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const handleSocialUserLogin = async () => {
      try {
        const url = dbBaseURL + `/${state.socialId}/socialUserLogin`;
        const { data } = await Axios.get(url, {
          signal: abortSignal,
        });

        console.log("data returned from handleSocialUserLogin==>", data);

        dispatch({ type: "socialUser_id", data: data.user._id });
        //   } catch (e) {
        //     console.log("error.name==>", e.name);
        //   }
      } catch (e) {
        console.log("error==>", e);
      }
    };
    if (state.socialUserObj) handleSocialUserLogin();
    return () => controller.abort();
  }, [state.socialUserObj]);

  console.log("state.userId==>", state.userId);

  useEffect(() => {
    // will need a sepearate one for gitHub user?
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
      // console.log("state.today==>", state.today);
      const currentDay = new Date();

      if (!state.loggedIn || !state.socialUser) return;

      if (isSameDay(new Date(state.today), currentDay)) return;

      // if (!isSameDay(new Date(parseInt(state.today)), new Date(currentDay))) {
      //if (!isSameDay(new Date(state.today), currentDay)) {
      console.log("diff day detectected");
      dispatch({ type: "updateToday", data: currentDay.toDateString() });
      localStorage.setItem("medsTrackerToday", currentDay.toDateString());
      // }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("state.userId==>", state.userId);
  }, [state.userId]);

  return (
    // <div className="flex  items-center justify-center bg-cyan-50">
    <div className="min-h-screen items-center justify-center space-y-10 bg-cyan-50 p-6">
      {/* <div className="m-3 min-w-[80%] items-center justify-center space-y-10 rounded-3xl bg-white shadow-2xl"> */}
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <DBProvider>
            <BrowserRouter>
              <HeaderWrapper />
              <Routes>
                {/* <Route path='/profile/:username/*' element={<Profile />} />  */}
                <Route
                  path="/"
                  element={
                    state.loggedIn || state.socialUserObj ? (
                      <MedList />
                    ) : (
                      <HomeGuest />
                    )
                  }
                />
              </Routes>
            </BrowserRouter>
          </DBProvider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
    // </div>
  );
};

export default App;
