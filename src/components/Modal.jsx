/* eslint-disable react/prop-types */
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Modal({ children, isOpen, closeFn, setIsClosing, isClosing }) {
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") closeFn();
    }

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [closeFn]);

  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 top-0  flex items-center justify-center">
      <div
        onAnimationEnd={() => setIsClosing(false)}
        className={`overlay ${
          !isClosing ? "animate-fadeIn" : "animate-fadeOut"
        } fixed h-[100%] w-[100%]`}
        onClick={closeFn}
      />
      <div
        className={`${
          !isClosing ? "animate-popIn" : "animate-popOut"
        } z-10 min-w-[300px] max-w-[95%] rounded-lg bg-white p-[1rem]`}
      >
        {children}
      </div>
    </div>,
    document.querySelector("#modal-container"),
  );
}
