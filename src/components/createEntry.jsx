import React, { useEffect, useState, useContext } from 'react';
import debounce from 'lodash/debounce';

import Axios from 'axios';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
//console.log('medsBaseULR==>', medsBaseURL);
import { StateContext, DispatchContext } from '../Contexts';
import { redirect, useNavigate } from 'react-router-dom';

const CreateEntry = () => {
  const [medArray, setMedArray] = useState([]);
  const [selected, setSelected] = useState();
  const [times, setTimes] = useState(0);
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  const timesArray = [1, 2, 3, 4, 5];

  const generateTimePickers = n => {
    let content = [];
    for (let i = 0; i < n; i++) {
      content.push(
        <div className='flex flex-col space-y-2 items-start'>
          <p className='text-md font-normal text-secondary'>Dose{i + 1}</p>
          <input
            id={`timepicker-${i}`}
            key={`timepicker-${i}`}
            onBlur={e => handleTimePicker(e, i)}
            type='time'></input>
        </div>
      );
    }
    return (
      <>
        <p className='self-start text-md mt-4 font-medium text-primary'>
          Please select medication administration times
        </p>
        <div className='grid grid-cols-2 gap-8 p-2 md:grid-cols-5 mt-2 md:space-y-0 md:gap-10'>
          {content}
        </div>
      </>
    );
  };

  const handleChange = async event => {
    const medName = event.target.value;

    try {
      const url =
        medsBaseURL +
        `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;
      const { data } = await Axios.get(url);
      setMedArray(e => data[1]);
      //console.log('medArray==>', medArray);
    } catch (e) {
      console.log('err==>', e);
    }
  };

  const handleSelected = e => {
    setSelected(e.target.value);
  };

  const handleTimePicker = (e, i) => {
    console.log('i==>', i);
    setPickedTimes(prevState => {
      const copy = [...prevState];
      copy[i] = e.target.value;
      return copy;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const slots = pickedTimes.slice(0, times);
    console.log('slots==>', slots);

    const data = { userId: mainState.user.userId, schedule: [] };

    slots.forEach(slot => {
      data.schedule.push({ med: selected, time: slot, taken: false });
    });

    console.log('data==>', data);
    try {
      const url = dbBaseURL + '/addToSchedule';
      const response = await Axios.post(url, data);
      //setMedArray(e => data[1]);
      //console.log('medArray==>', medArray);
      console.log('response==>', response);
      mainDispatch({ type: 'addToSchedule', data: response.data });
    } catch (e) {
      console.log('err==>', e);
    }
  };

  useEffect(() => {
    // console.log('current selected==>', selected);
    // console.log('frequencey==>' + times + ` times`);
    console.log('pickedTimes==>', pickedTimes);
  }, [pickedTimes]);

  return (
    <>
      <div className='flex flex-col items-start rounded-lg p-4 space-y-2'>
        <div className='text-lg font-medium text-primary'>Add a new medication</div>
        <form className='w-full flex-col items-center' onSubmit={handleSubmit}>
          {/* <label htmlFor='medname'> */}
          {/* <input
              id='medname'
              type='text'
              list='medArray'
              onChange={debounce(handleChange, 200)}
              onBlur={e => handleSelected(e)}
            /> */}
          {/* </label> */}
          <div className='flex flex-col space-y-2 items-center justify-start md:flex-row md:space-x-2 md:space-y-0'>
            <div className='w-full md:w-[50%]'>
              <input
                type='text'
                className='w-full text-sm p-3 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light'
                placeholder='name of medication'
                id='medname'
                list='medArray'
                onChange={debounce(handleChange, 200)}
                onBlur={e => handleSelected(e)}
              />
              <datalist id='medArray'>
                {medArray.map(med => (
                  <option value={med} key={med}>
                    {med}
                  </option>
                ))}
              </datalist>
            </div>

            {/* <label htmlFor='medname'>
              How many times in a day do you take this medication?
              <input // use Select ????
                id='times'
                type='text'
                list='timesArray'
                // onChange={debounce(handleTimesChange, 300)}
                onChange={e => setTimes(e.target.value)}
              />
            </label> */}
            <div className='w-full md:w-[50%]'>
              <input
                type='text'
                className='w-full text-sm text-wrap p-3 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light placehoder:text-sm'
                placeholder='how many times a day do you take this medication?'
                id='times'
                list='timesArray'
                onChange={e => setTimes(e.target.value)}
              />
              <datalist id='timesArray'>
                {timesArray.map(time => (
                  <option key={time}>{time}</option>
                ))}
              </datalist>
            </div>
          </div>

          <div className='flex flex-col justify-start items-center'>
            {times > 0 && generateTimePickers(times)}
          </div>
          <div className='flex w-full items-center justify-center'>
            <button
              type='submit'
              className=' text-white px-4 py-3 my-6 bg-orange text-center border border-orange rounded-lg duration-200 hover:bg-warm hover:border-warm'>
              OK
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEntry;
