/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Med = (props) => {
  const { med, time, _id, taken } = props.medListItem;
  const { idx, handleCheck } = props;

  return (
    <button
      className={`flex w-[100%] cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-[.25rem] border-none ${
        taken ? "bg-gray-400" : "bg-pink-300"
      } bg-purple-600 px-1 py-1.5 font-[1rem]`}
    >
      <input
        onChange={(e) => {
          e.target.checked = e.target.checked;
          handleCheck(e);
        }}
        className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500`}
        type="checkbox"
        id={_id}
        name={idx}
        value={[time, med]}
        checked={taken}
      />
      <label
        className={`${taken ? "line-through" : ""}`}
        htmlFor="medCheckbox"
      >{`${time} ${med}`}</label>
    </button>
  );
};

export default Med;
