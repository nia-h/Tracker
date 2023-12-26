import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import ReactTooltip from 'react-tooltip';

import { DispatchContext, StateContext } from "../Contexts";

function HeaderLoggedIn() {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  function handleLogout() {
    if (mainState.loggedIn) {
      mainDispatch({ type: "logout" });
    } else if (mainState.socialUsername) {
      mainDispatch({ type: "socialLogout" });
      window.location.href = dbBaseURL + `/auth/logout`;
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
