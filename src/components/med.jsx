/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Med = props => {
  const { med, time, key } = props.medListItem;
  //st date = new Date(Med.createdDate);
  //   const dateFormatted = `${
  //     date.getMonth() + 1
  //   }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <>
      <input
        className='bg-blue-400 m-2 rounded-md w-10'
        type='checkbox'
        id='medCheckbox'
        name='medCheckbox'
        value={med}
      />
      <label htmlFor='medCheckbox'>{`${time} ${med}`}</label>
    </>
  );
};

export default Med;
