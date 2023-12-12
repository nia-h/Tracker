import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import { DispatchContext, StateContext } from "../Contexts";

function HeaderWrapper(props) {
  const mainState = useContext(StateContext);

  console.log("mainState==>", mainState);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* <!-- Flex Container For Logo/Menu --> */}
        <div className="flex items-center space-x-20">
          {/* <!-- Logo --> */}
          <img src="/images/logo.png" width="400" alt="" />
        </div>
        {/* 
        <!-- Right Buttons Menu --> */}
        {mainState.loggedIn || mainState.socialUserObj ? (
          <HeaderLoggedIn />
        ) : (
          <HeaderLoggedOut />
        )}
        {}
      </div>

      {/* <header className="">
        <div className="flex flex-col items-center justify-center space-x-8 space-y-3 md:mb-24 md:flex-row md:justify-end md:space-x-44 md:space-y-0">
          <h4 className="">
        
          </h4>
         
        </div>
      </header> */}
    </>
  );
}

export default HeaderWrapper;
