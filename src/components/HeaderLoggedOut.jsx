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
        className="rounded-full bg-[var(--primaryBlue)] px-6 py-3 font-bold text-white transition-all duration-150  hover:opacity-70 hover:shadow-lg"
      >
        Sign in
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

  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

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
        <div className="sign-in-view flex flex-col content-center items-center bg-base">
          <form onSubmit={handleSubmit} className="mb-2 rounded px-8 py-2">
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                for="email"
              >
                Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:border-primaryBlue focus:outline-none"
                id="email"
                type="text"
                placeholder="you@email.com"
              />
            </div>
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                for="password"
              >
                Password
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:border-primaryBlue focus:outline-none"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>

            <button
              className="ml-auto mr-auto block h-[48px] w-[90%] cursor-pointer rounded-[24px] bg-primaryBlue px-2 shadow-social-button-shadow"
              type="submit"
            >
              Sign In
            </button>
          </form>
          <div className="mb-4 flex flex-col content-center items-center rounded px-8 ">
            <div className="sign-in-divider mb-4">
              <span className="">or</span>
            </div>
            <div className="social-buttons mb-[10px] flex flex-col content-center items-center">
              <div
                onClick={github}
                className="github social-button flex h-[48px] cursor-pointer flex-row items-center rounded-[24px] bg-white px-2 py-2 shadow-social-button-shadow"
              >
                <div className="github-image">
                  <img
                    className=" flex h-[40px] items-center pr-[16px]"
                    src="/images/github-mark.svg"
                  />
                </div>
                <span className="social-button-text github-button-text flex h-[40px] items-center text-sm font-[500] text-[rgba(0,0,0,.54)]">
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
