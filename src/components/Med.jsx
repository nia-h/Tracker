/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Med = (props) => {
  //style requires rewrite to keep fixed sized checkbox
  const { med, time, _id, taken } = props.course;
  const { idx, handleCheck } = props;

  return (
    <button
      className={`flex w-[100%] cursor-pointer items-start overflow-hidden whitespace-normal rounded-[.25rem] border-none text-sm md:whitespace-nowrap md:text-base ${
        taken ? "bg-gray-400" : "bg-pink-300"
      }  px-1 py-1.5 font-[1rem]`}
    >
      <input
        onChange={(e) => {
          e.target.checked = e.target.checked;
          handleCheck(e);
        }}
        className={`mr-2 h-4 w-4 flex-shrink-0 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500`}
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
    </button>
  );
};

export default Med;
