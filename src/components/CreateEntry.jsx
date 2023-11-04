import React, { useEffect, useState, useContext, useRef } from "react";
import debounce from "lodash/debounce";

import Axios from "axios";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
//console.log('medsBaseULR==>', medsBaseURL);
import { StateContext, DispatchContext } from "../Contexts";
import { redirect, useNavigate } from "react-router-dom";

const CreateEntry = () => {
  const [medArray, setMedArray] = useState([]);
  const [selected, setSelected] = useState();
  const [times, setTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  const timesArray = [1, 2, 3, 4, 5];

  const generateTimePickers = (n) => {
    let content = [];
    for (let i = 0; i < n; i++) {
      content.push(
        <div className="flex flex-col items-start space-y-2">
          <p className="text-md font-normal text-secondary">Dose{i + 1}</p>
          <input
            id={`timepicker-${i}`}
            key={`timepicker-${i}`}
            onBlur={(e) => handleTimePicker(e, i)}
            type="time"
          ></input>
        </div>,
      );
    }
    return (
      <>
        <p className="text-md mt-4 self-start font-medium text-primary">
          Please select medication administration times
        </p>
        <div className="mt-2 grid grid-cols-2 gap-8 p-2 md:grid-cols-5 md:gap-10 md:space-y-0">
          {content}
        </div>
      </>
    );
  };

  const handleChange = async (event) => {
    const medName = event.target.value;

    try {
      const url =
        medsBaseURL +
        `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;
      const { data } = await Axios.get(url);
      setMedArray((e) => data[1]);
    } catch (e) {
      console.log("err==>", e);
    }
  };

  const handleSelected = (e) => {
    setSelected(e.target.value);
  };

  const handleTimePicker = (e, i) => {
    console.log("i==>", i);
    setPickedTimes((prevState) => {
      const copy = [...prevState];
      copy[i] = e.target.value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputRef.current === null) return;
    setIsLoading(true);
    const slots = pickedTimes.slice(0, times);
    console.log("slots==>", slots);

    const data = { userId: mainState.user.userId, schedule: [] };

    slots.forEach((slot) => {
      data.schedule.push({ med: selected, time: slot, taken: false });
    });

    console.log("data==>", data);
    try {
      const url = dbBaseURL + "/addToSchedule";
      const response = await Axios.post(url, data);
      //setMedArray(e => data[1]);
      //console.log('medArray==>', medArray);
      // console.log("response==>", response);
      mainDispatch({ type: "addToSchedule", data: response.data });
      setIsLoading(false);
    } catch (e) {
      console.log("err==>", e);
    }
  };

  // useEffect(() => {
  //   // console.log('current selected==>', selected);
  //   // console.log('frequencey==>' + times + ` times`);
  //   console.log("pickedTimes==>", pickedTimes);
  // }, [pickedTimes]);

  return (
    <>
      <div className="flex flex-col items-start space-y-2 rounded-lg p-4">
        <div className="text-lg font-medium text-primary">
          Add a new medication
        </div>
        <form className="w-full flex-col items-center" onSubmit={handleSubmit}>
          {/* <label htmlFor='medname'> */}
          {/* <input
              id='medname'
              type='text'
              list='medArray'
              onChange={debounce(handleChange, 200)}
              onBlur={e => handleSelected(e)}
            /> */}
          {/* </label> */}
          <div className="flex flex-col items-center justify-start  space-y-2 md:flex-row md:space-x-2 md:space-y-0    ">
            <div className="w-full md:w-[50%]">
              <input
                required
                type="text"
                ref={inputRef}
                className="h-10 w-full rounded-md border border-gray-300 px-3 pb-2 pt-4 text-sm placeholder-gray-400 placeholder:font-sans placeholder:font-light"
                placeholder="name of medication"
                id="medname"
                list="medArray"
                onChange={debounce(handleChange, 200)}
                onBlur={(e) => handleSelected(e)}
              />
              <datalist id="medArray">
                {medArray.map((med) => (
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
            <div className="w-full md:w-[50%]">
              {/* <input
                type='text'
                
              /> */}
              {/* <datalist id='timesArray'>
                {timesArray.map(time => (
                  <option key={time}>{time}</option>
                ))}
              </datalist> */}
              <select
                id="timesArray"
                required
                className="h-10 w-full rounded-md border border-gray-300 p-3 font-sans text-sm font-light invalid:text-gray-400"
                onChange={(e) => setTimes(e.target.value)}
              >
                <option className="" value="" selected disabled>
                  how many times a day do you take this medication?
                </option>
                {/* the value='' makes above option invalid */}
                {timesArray.map((time) => (
                  <option className="optin" key={time}>{`${time}`}</option> //If the value attribute is not specified, the content will be passed as a value instead.
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start">
            {times > 0 && generateTimePickers(times)}
          </div>
          <div className="flex w-full items-center justify-center">
            <button
              disabled={isLoading}
              type="submit"
              className="my-6 rounded-lg border border-orange bg-orange px-4 py-3 text-center text-white duration-200 hover:border-warm hover:bg-warm disabled:bg-blue-300"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEntry;
