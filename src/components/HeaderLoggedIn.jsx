import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import ReactTooltip from 'react-tooltip';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import { useNavigate } from "react-router-dom";
import { DispatchContext, StateContext } from "../Contexts";
// import CreateEntry from './CreateEntry';

function HeaderLoggedIn(props) {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  function handleLogout() {
    mainDispatch({ type: "logout" });
  }

  // function handleSearchIcon(e) {
  //   e.preventDefault();
  //   mainDispatch({ type: 'openSearch' });
  // }

  return (
    <>
      <div className="">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 rounded-lg border-2 border-secondary px-5 py-3 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-opacity-30 hover:shadow-lg"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
