import React, { useContext } from "react";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import { StateContext } from "../Contexts";

function HeaderWrapper(props) {
  const mainState = useContext(StateContext);

  return (
    <>
      <div className="flex w-full justify-between">
        {/* <!-- Flex Container For Logo/Menu --> */}
        <div className="flex items-center">
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
    </>
  );
}

export default HeaderWrapper;
