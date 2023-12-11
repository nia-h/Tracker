import React, { useState, useContext, useLayoutEffect, useRef } from "react";
//import Page from "./Page"
import Axios from "axios";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
// const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import { useNavigate } from "react-router-dom";
import { DispatchContext, StateContext } from "../Contexts";
import { Modal } from "./Modal.jsx";

const HeaderLoggedOut = () => {
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsLogInModalOpen(true)}
        type="submit"
        className="rounded-full bg-[var(--accent)] px-6 py-3 font-bold text-white transition-all duration-150  hover:opacity-70 hover:shadow-lg"
      >
        Sign In
      </button>
      <LogInModal
        isOpen={isLogInModalOpen}
        // submitFn={addEvent} //shorthand for onSubmit={newEvent => addEvent(newEvent)}
        closeFn={() => setIsLogInModalOpen(false)}
      />
    </>
  );
};

export default HeaderLoggedOut;

function LogInModal({ isOpen, closeFn }) {
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef();

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true);
    }

    prevIsOpen.current = isOpen;
  }, [isOpen]);

  return (
    (isOpen || isClosing) && (
      <LogInModalInner
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      />
    )
  );
}

function LogInModalInner({ isClosing, setIsClosing, isOpen, closeFn }) {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  const mainState = useContext(StateContext);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const mainDispatch = useContext(DispatchContext);

  const github = () => {
    window.open(`${dbBaseURL}/auth/github`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (inputRef.current === null) return;
    setIsLoading(true);

    closeFn();

    try {
      const { data } = await Axios.post(`${dbBaseURL}/login`, {
        email,
        password,
      });
      if (data) {
        // console.log("data==>", data);
        mainDispatch({ type: "login", data });
      } else {
        console.log("Incorrect username / password.");
      }
    } catch (e) {
      console.log("err==>", e);
    }

    navigate("/");
  };

  return (
    (isOpen || isClosing) && (
      <Modal
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      >
        <div className="sign-in-view flex flex-col content-center items-center">
          <div className="title">Sign In</div>
          <form
            className="flex flex-col items-center justify-center space-y-3 md:mb-8 md:flex-row md:justify-end md:space-x-4 md:space-y-0"
            onSubmit={handleSubmit}
          >
            <div className="">
              <label htmlFor="email-register" className="">
                <small>Email</small>
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email-register"
                name="email"
                className=""
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="">
                <small>Password</small>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password-register"
                name="password"
                className=""
                type="password"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              className="w-1/4 rounded-lg bg-secondary text-white transition-all  duration-150 hover:border-b-0 hover:border-t-8 hover:bg-primary hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
          <div className="form-header mx-[auto] flex w-[90%] flex-col content-center items-center">
            <div className="sign-in-divider">
              <span>or</span>
            </div>
            <div className="social-buttons mb-[10px] flex flex-col content-center items-center">
              <div
                onClick={github}
                className="github social-button flex h-[48px] w-[100%] cursor-pointer flex-row items-center rounded-[24px] bg-[#fff] px-2 py-[16px] shadow-social-button-shadow"
              >
                <div className="github-image">
                  <img
                    className=" flex h-[40px] items-center pr-[16px]"
                    src="/images/github-mark.svg"
                  />
                </div>
                <span className="social-button-text github-button-text flex h-[40px] items-center text-[14px] font-[500] text-[rgba(0,0,0,.54)]">
                  Sign in with github
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  );
}
