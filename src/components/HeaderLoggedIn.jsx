import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// import ReactTooltip from 'react-tooltip';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import { useNavigate } from 'react-router-dom';
import { DispatchContext, StateContext } from '../Contexts';
import CreateEntry from './CreateEntry';

function HeaderLoggedIn(props) {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  function handleLogout() {
    mainDispatch({ type: 'logout' });
  }

  // function handleSearchIcon(e) {
  //   e.preventDefault();
  //   mainDispatch({ type: 'openSearch' });
  // }

  return (
    <>
      <div className=''>
        <button className='flex items-center text-sm font-medium justify-center py-3 px-5 space-x-3 border-2 border-secondary rounded-lg shadow-sm hover:bg-opacity-30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150'>
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
