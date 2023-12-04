import React, { useState, useContext } from "react";
//import Page from "./Page"
import Axios from "axios";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
// const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import { useNavigate } from "react-router-dom";
import { DispatchContext } from "../Contexts";

const HeaderLoggedOut = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const mainDispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    // <Page title="Welcome!" wide={true}>
    <div className="">
      <div className="">
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
      </div>
    </div>
    // </Page>
  );
};

export default HeaderLoggedOut;
