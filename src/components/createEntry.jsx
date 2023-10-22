import React, { useEffect, useState, useContext } from 'react';
import debounce from 'lodash/debounce';

import Axios from 'axios';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
//console.log('medsBaseULR==>', medsBaseURL);
import { StateContext } from '../Contexts';

const CreateEntry = () => {
  const [medArray, setMedArray] = useState([]);
  const [selected, setSelected] = useState();
  const [times, setTimes] = useState(0);
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainState = useContext(StateContext);

  const timesArray = [1, 2, 3, 4, 5];

  const generateTimePickers = n => {
    let content = [];
    for (let i = 0; i < n; i++) {
      content.push(
        <input
          id={`timepicker-${i}`}
          key={`timepicker-${i}`}
          onBlur={e => handleTimePicker(e, i)}
          type='time'></input>
      );
    }
    return <div>{content}</div>;
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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='medname'>
          Enter medication name
          <input
            id='medname'
            type='text'
            list='medArray'
            onChange={debounce(handleChange, 300)}
            onBlur={e => handleSelected(e)}
          />
        </label>
        <datalist id='medArray'>
          {medArray.map(med => (
            <option value={med} key={med}>
              {med}
            </option>
          ))}
        </datalist>
        <label htmlFor='medname'>
          How many times a day do you take this medication?
          <input // use Select ????
            id='times'
            type='text'
            list='timesArray'
            // onChange={debounce(handleTimesChange, 300)}
            onChange={e => setTimes(e.target.value)}
          />
        </label>
        <datalist id='timesArray'>
          {timesArray.map(time => (
            <option key={time}>{time}</option>
          ))}
        </datalist>
        <div>{times > 0 && generateTimePickers(times)}</div>
        <button type='submit'>OK</button>
      </form>
    </div>
  );
};

export default CreateEntry;
