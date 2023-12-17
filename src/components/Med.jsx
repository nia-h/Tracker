/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Med = (props) => {
  //style requires rewrite to keep fixed sized checkbox
  const { med, time, _id, taken } = props.course;
  const { idx, handleCheck, handleDelete } = props;

  return (
    <div
      className={`flex w-[100%] items-center justify-between overflow-hidden ${
        taken ? "bg-subtitle  text-white" : "bg-pink-200  text-primaryBlue"
      } whitespace-normal rounded-[.25rem] border-none px-1 py-1.5  font-[1rem]`}
    >
      <div>
        <input
          onChange={(e) => {
            e.target.checked = e.target.checked;
            handleCheck(e);
          }}
          className={`mr-2 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500`}
          type="checkbox"
          id={_id}
          name={idx}
          value={[time, med]}
          checked={taken}
        />
        <label
          className={`${taken ? "line-through" : ""} text-start`}
          htmlFor="medCheckbox"
        >{`${time} ${med}`}</label>
      </div>
      <img
        id={_id}
        className="z-10 cursor-pointer"
        onClick={handleDelete}
        width="26"
        src={`${
          taken
            ? "/images/delete-icon-gray.svg"
            : "/images/delete-icon-blue.svg"
        }`}
        alt=""
      />
      {/* <span class="bg-gray-300">abc</span> */}
      {/* <div className="h-4 w-4 flex-shrink-0 rounded-full border-gray-300 bg-gray-100 text-center align-middle text-2xl leading-4 text-blue-600 focus:ring-2 focus:ring-blue-500">
        ×
      </div> */}
    </div>
  );
};

export default Med;
