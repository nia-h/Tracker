import React, { useState, useRef, useLayoutEffect } from "react";
import Axios from "axios";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
import { Modal } from "./Modal";

function HomeGuest() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <section className="mx-auto" id="hero">
        {/* <!-- Hero Container --> */}
        <div className="container mx-auto flex flex-col-reverse p-6 lg:flex-row">
          {/* <!-- Content Container --> */}
          <div className=" mb-44 flex flex-col space-y-10 lg:mt-16 lg:w-1/2 xl:mb-52">
            <h1 className="text-center text-5xl font-bold lg:max-w-md lg:text-left lg:text-6xl">
              Your trusted medication tracker
            </h1>
            <p className="text-center text-2xl text-subtitle lg:max-w-md lg:text-left">
              Keeping a perfect medication regimen effortlessly
            </p>
            <div className="mx-auto lg:mx-0">
              <button
                onClick={() => {
                  setIsSignInModalOpen(true);
                }}
                className="rounded-full px-10 py-5 text-2xl font-bold text-white hover:opacity-70 lg:py-4"
              >
                sign up
              </button>
            </div>
          </div>
          {/* 
        <!-- Image --> */}
          <div className="mx-auto mb-4 -translate-x-14 md:w-[32rem] lg:mb-0 lg:w-1/2">
            <img
              className="h-[auto] max-w-[100%]"
              src="/images/Medicine-amico.svg"
              alt=""
              height="1200"
              width="1200"
            />
            <a
              className="block -translate-y-12 translate-x-14 text-end text-[0.8rem] text-subtitle"
              href="https://storyset.com/work"
            >
              Work illustrations by Storyset
            </a>
          </div>
        </div>
      </section>
      <SignInModal
        isOpen={isSignInModalOpen}
        // submitFn={addEvent} //shorthand for onSubmit={newEvent => addEvent(newEvent)}
        closeFn={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}

function SignInModal({ isOpen, closeFn }) {
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
      <SignInModalInner
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      />
    )
  );
}

function SignInModalInner({ isClosing, setIsClosing, isOpen, closeFn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await Axios.post(`${dbBaseURL}/register`, {
        email,
        password,
      });

      if (data.user) {
        setEmail("");
        setPassword("");
      }
      closeFn();
    } catch (e) {
      console.log("err==>", e);
    }
  }

  return (
    (isOpen || isClosing) && (
      <Modal
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      >
        <div className="bg-blue-300">
          <div className="col-lg-7 py-md-5 py-3">
            <h1 className="display-3">Meds Tracker</h1>
            <p className="lead text-muted"></p>
          </div>

          <div className="col-lg-5 pl-lg-5 py-lg-5 pb-3">
            <form onSubmit={handleSubmit}>
              <div className="form-group"></div>
              <div className="form-group">
                <label htmlFor="email-register" className="text-muted mb-1">
                  <small>Email</small>
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-register"
                  name="email"
                  className="form-control"
                  type="text"
                  placeholder="you@example.com"
                  autoComplete="off"
                  value={email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password-register"
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                />
              </div>
              <button type="submit" className="">
                Sign up for Meds Tracker
              </button>
            </form>
          </div>
        </div>
      </Modal>
    )
  );
}

export default HomeGuest;
