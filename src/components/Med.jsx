/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Med = (props) => {
  const { med, time, _id, taken } = props.medListItem;
  //   console.log('taken in Med==>', taken);
  //   console.log('med _id==>', _id);
  const { idx, handleCheck } = props;

  //   const [checked, setChecked] = useState(false);
  //st date = new Date(Med.createdDate);
  //   const dateFormatted = `${
  //     date.getMonth() + 1
  //   }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <>
      {/* <input
        id='default-checkbox'
        type='checkbox'
        value=''
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 hidden rounded focus:ring-blue-500 focus:ring-2'
      /> */}

      <input
        checked={taken}
        // onChange={handleCheck}

        className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500`}
        type="checkbox"
        id={_id}
        name={idx}
        // value={[time, med]}
        // onClick={handleCheck}
      />
      <label
        className={`${taken ? "line-through" : ""}`}
        htmlFor="medCheckbox"
      >{`${time} ${med}`}</label>
    </>
  );
};

export default Med;
