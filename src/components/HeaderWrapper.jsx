import React, { useContext } from "react";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import { StateContext } from "../Contexts";

function HeaderWrapper(props) {
  const mainState = useContext(StateContext);

  return (
    <>
      {/* <div className="flex h-[3rem] w-full flex-col justify-between"> */}
      <div
        className="flex flex-col items-center justify-center space-y-2 md:mb-2 md:flex-row md:justify-end md:space-x-8 md:space-y-0
"
      >
        {/* <!-- Flex Container For Logo/Menu --> */}
        <div className="flex items-center">
          {/* <!-- Logo --> */}
          <img src="/images/logo.png" width="400" alt="" />
        </div>
        {/* 
        <!-- Right Buttons Menu --> */}
        {mainState.loggedIn || mainState.socialUsername ? (
          <HeaderLoggedIn />
        ) : (
          <HeaderLoggedOut />
        )}
        {}
      </div>
    </>
  );
}

export default HeaderWrapper;
