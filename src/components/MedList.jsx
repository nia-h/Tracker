/* eslint-disable react/prop-types */
import React, {
  useMemo,
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import Axios from "axios";

import { isSameDay, parseISO } from "date-fns";

import { StateContext, DispatchContext } from "../Contexts";
// import LoadingDotsIcon from './LoadingDotsIcon';

import Med from "./Med.jsx";
import _ from "lodash";
import { Modal } from "./Modal.jsx";
import debounce from "lodash/debounce";
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import times from "lodash/fp/times.js";
const _times = times;

const abortController = new AbortController();

const MedList = () => {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  const schedule = mainState.schedule;
  const today = mainState.today;
  const userId = mainState.userId;
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // const sortedSchedule = useMemo(() => {
  //   const timeToNumber = (time) => parseFloat(time.replace(":", "."));

  //   return [...schedule].sort((a, b) => {
  //     if (a.allDay && b.allDay) {
  //       return 0;
  //     } else if (a.allDay) {
  //       return -1;
  //     } else if (b.allDay) {
  //       return 1;
  //     } else {
  //       return timeToNumber(a.startTime) - timeToNumber(b.startTime);
  //     }
  //   });
  // }, [schedule]);

  async function handleCheck(e) {
    const id = e.target.id;

    const nextSchedule = schedule.map((med, i) => {
      if (med._id !== id) {
        return med;
      } else {
        return {
          ...med,
          taken: !med.taken,
        };
      }
    });

    //const newProfile = { ...profile, schedule: nextSchedule };

    mainDispatch({ type: "updateSchedule", data: nextSchedule });

    try {
      const url = dbBaseURL + "/checkItem";
      const { data } = await Axios.post(
        url,
        {
          userId: mainState.userId,
          nextSchedule,
        },
        // { signal: abortController.signal }
      );
      // console.log('response==>', response);
      // setProfile(data);
    } catch (e) {
      // if (Axios.isCancel(e)) {
      //   console.log('Request canceled', e.message);
      // } else {
      //   console.log(e);
      // }
      console.log(e);
    }
  }

  const fetchMeds = async () => {
    // const today = new Date().toDateString();
    //const today = Date.now();

    try {
      let { data } = await Axios.get(
        `${dbBaseURL}/${userId}/regimen`,
        // { cancelToken: ourRequest.token }
      );
      if (data == null) return;

      let schedule = data.schedules[data.lastActiveDay];
      if (!isSameDay(today, new Date(parseInt(data.lastActiveDay)))) {
        //need to handle these on the backend
        // console.log("oldSchedule==>", data);
        //setProfile(data);

        schedule = schedule.map((course) => {
          course.taken = false;
          return course;
        });
      }
      console.log("schedule==>", schedule);
      mainDispatch({ type: "updateSchedule", data: schedule });

      await Axios.post(`${dbBaseURL}/${userId}/renewRegimen`, {
        lastActiveDay: today,
        schedule,
      });
    } catch (e) {
      // { cancelToken: ourRequest.token }

      // set(response.data);

      // setIsLoading(false);
      // if (Axios.isCancel(e)) {
      //   console.log('Request canceled', e.message);
      // } else {
      //   console.log(e);
      // }
      console.log(e);
    }
  };

  useEffect(() => {
    // const ourRequest = Axios.CancelToken.source();

    fetchMeds();
    // return () => {
    //   ourRequest.cancel();
    // };
  }, []);

  // if (isLoading) return <LoadingDotsIcon />;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = Date.now();

      if (!isSameDay(today, currentDay)) {
        mainDispatch({ type: "updateToday", data: currentDay });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!schedule[0] ? (
        <>
          <button
            onClick={() => setIsAddMedModalOpen(true)}
            className="flex items-center justify-center space-x-3 rounded-lg border-2 border-secondary bg-pink-200 px-5 py-3 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-opacity-30 hover:shadow-lg"
          >
            Add a your first medication to start using Tracker
          </button>
        </>
      ) : (
        <>
          <div className="not-taken flex flex-grow flex-col gap-2 overflow-hidden px-4 py-8">
            {
              // profile.schedule.length > 0 &&
              schedule.map((medListItem, idx) => {
                if (medListItem.taken === false) {
                  return (
                    <Med
                      medListItem={medListItem}
                      handleCheck={handleCheck}
                      key={medListItem._id}
                      taken={medListItem.taken}
                      id={medListItem._id}
                      idx={idx}
                    />
                  );
                }
              })
            }
          </div>

          <div className="taken flex flex-grow flex-col gap-2 overflow-hidden px-4 py-8">
            {
              // profile.schedule.length > 0 &&
              schedule.map((medListItem, idx) => {
                if (medListItem.taken === true) {
                  return (
                    <Med
                      medListItem={medListItem}
                      handleCheck={handleCheck}
                      key={medListItem._id}
                      taken={medListItem.taken}
                      id={medListItem._id}
                      idx={idx}
                    />
                  );
                }
              })
            }
          </div>
          <div>
            <button
              onClick={() => setIsAddMedModalOpen(true)}
              className="flex items-center justify-center space-x-3 rounded-lg border-2 border-secondary bg-pink-200 px-5 py-3 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-opacity-30 hover:shadow-lg"
            >
              Add a new medication
            </button>
          </div>
        </>
      )}
      <AddMedFormModal
        isOpen={isAddMedModalOpen}
        // submitFn={addEvent} //shorthand for onSubmit={newEvent => addEvent(newEvent)}
        closeFn={() => setIsAddMedModalOpen(false)}
      />
    </>
  );
};

function AddMedFormModal({ isOpen, closeFn }) {
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef();

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true);
    }

    prevIsOpen.current = isOpen;
  }, [isOpen]);

  return (
    (isOpen || isClosing) && (
      <AddMedFormModalInner
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      />
    )
  );
}

function AddMedFormModalInner({ isClosing, setIsClosing, isOpen, closeFn }) {
  const [medsDropdown, setMedsDropdown] = useState([]);
  const [selectedMed, setSelectedMed] = useState();
  const [times, setTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  // const schedule = mainState.schedule;
  const today = mainState.today;
  const userId = mainState.userId;
  const generateTimePicker = (i) => {
    return (
      <div className="flex flex-col items-start space-y-2">
        <p
          className={`text-md font-normal ${
            i < times ? "text-secondary" : "text-gray-500"
          }`}
        >
          Dose {i + 1}
        </p>
        <input
          id={`timepicker-${i}`}
          key={`timepicker-${i}`}
          onBlur={(e) => handleTimePicker(e, i)}
          type="time"
          disabled={i >= times}
        ></input>
      </div>
    );
  };

  const handleMedsDropdown = async (event) => {
    const medName = event.target.value;

    try {
      const url =
        medsBaseURL +
        `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;
      const { data } = await Axios.get(url);
      setMedsDropdown(() => data[1]);
    } catch (e) {
      console.log("err==>", e);
    }
  };

  const handleSelectedMed = (e) => {
    setSelectedMed(e.target.value);
  };

  const handleTimePicker = (e, i) => {
    setPickedTimes((prevState) => {
      const copy = [...prevState];
      copy[i] = e.target.value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputRef.current === null) return; // more validations needed
    setIsLoading(true);
    const slots = pickedTimes.slice(0, times);

    const schedule = [];

    slots.forEach((slot) => {
      schedule.push({ med: selectedMed, time: slot, taken: false });
    });

    closeFn();

    try {
      const url = dbBaseURL + "/updateSchedule";
      const { data } = await Axios.post(url, { userId, today, schedule });
      console.log("data from response==>", data);
      // console.log("typeof schedules==>", typeof data.schedules);
      const courses = data.schedules[data.lastActiveDay];
      console.log("retrieved schedule==>", courses); // will need to refactor backend to only send today's schedule
      mainDispatch({
        type: "updateSchedule",
        data: courses,
      });
    } catch (e) {
      console.log("err==>", e);
    }
  };

  return (
    (isOpen || isClosing) && (
      <Modal
        isOpen={isOpen}
        isClosing={isClosing}
        setIsClosing={setIsClosing}
        closeFn={closeFn}
      >
        {/* <div className="flex flex-col items-start space-y-2 rounded-lg p-4"> */}
        <div className="text-lg font-medium text-primary">
          Add a new medication
        </div>
        <form className="w-full flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-start  space-y-2 md:flex-row md:space-x-2 md:space-y-0    ">
            <div className="w-full md:w-[50%]">
              <input
                required
                type="text"
                ref={inputRef}
                className="h-10 w-full rounded-md border border-gray-300 px-3 pb-2 pt-4 text-sm placeholder-gray-400 placeholder:font-sans placeholder:font-light"
                placeholder="name of medication"
                id="medname"
                list="medsDropdown"
                onChange={debounce(handleMedsDropdown, 200)}
                onBlur={(e) => handleSelectedMed(e)}
              />
              <datalist id="medsDropdown">
                {medsDropdown.map((med) => (
                  <option value={med} key={med}>
                    {med}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="w-full md:w-[50%]">
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
                {_times(
                  (i) => (
                    <option className="option" key={i + 1}>{`${i + 1}`}</option> //If the value attribute is not specified, the content will be passed as a value instead.
                  ),
                  5,
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start">
            {/* {times > 0 && generateTimePickers(times)} */}
            <p className="text-md mt-4 self-start font-medium text-primary">
              Please select medication administration times
            </p>
            <div className="mt-2 grid grid-cols-2 gap-8 p-2 md:grid-cols-5 md:gap-10 md:space-y-0">
              {_times(generateTimePicker, 5)}
            </div>
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
      </Modal>
    )
  );
}

export default MedList;
