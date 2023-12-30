import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import ReactTooltip from 'react-tooltip';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;

import { DispatchContext, StateContext } from "../Contexts";
import Axios from "axios";

function HeaderLoggedIn() {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  async function handleLogout() {
    if (mainState.loggedIn) {
      mainDispatch({ type: "logout" });
    } else if (mainState.socialUsername) {
      mainDispatch({ type: "socialLogout" });
      try {
        const url = dbBaseURL + `/auth/logout`;
        const response = await Axios({
          method: "POST",
          url,
          withCredentials: true,
        });

        // await Axios.get(url, {
        //   //can out use Axios.post (backend unable to log out user)
        //   withCredentials: true,
        // });
        console.log("response.date==>", response.data);
        //   // await Axios.post(dbBaseURL + `/auth/logout`);
      } catch (e) {
        console.error("error==>", e);
      }
    }
  }

  return (
    <>
      <div className="">
        <button
          onClick={handleLogout}
          className=" ml-2 flex items-center justify-center space-x-3 whitespace-nowrap rounded-lg border-2 px-2 py-2 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-opacity-30 hover:shadow-lg"
        >
          <span className="text-white">Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
