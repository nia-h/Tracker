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
        Log In
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
        <form
          className="flex flex-col items-center justify-center space-y-3 md:mb-24 md:flex-row md:justify-end md:space-x-4 md:space-y-0"
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
            Log In
          </button>
        </form>
      </Modal>
    )
  );
}
