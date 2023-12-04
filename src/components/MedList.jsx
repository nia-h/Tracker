/* eslint-disable react/prop-types */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import Axios from "axios";

import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
  subMonths,
  addMonths,
  isSameDay,
  parse,
} from "date-fns";

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
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  const profile = mainState.profile;

  const sortedSchedule = useMemo(() => {
    const timeToNumber = (time) => parseFloat(time.replace(":", "."));

    return [...Schedule].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0;
      } else if (a.allDay) {
        return -1;
      } else if (b.allDay) {
        return 1;
      } else {
        return timeToNumber(a.startTime) - timeToNumber(b.startTime);
      }
    });
  }, [Schedule]);

  async function handleCheck(e) {
    const id = e.target.id;

    const nextSchedule = profile.schedule.map((med, i) => {
      if (med._id !== id) {
        return med;
      } else {
        return {
          ...med,
          taken: !med.taken,
        };
      }
    });

    const newProfile = { ...profile, schedule: nextSchedule };

    mainDispatch({ type: "addToSchedule", data: newProfile });

    try {
      const url = dbBaseURL + "/checkItem";
      const { data } = await Axios.post(
        url,
        {
          userId: mainState.user.userId,
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

  useEffect(() => {
    // const ourRequest = Axios.CancelToken.source();

    const fetchMeds = async () => {
      const today = new Date().toDateString();
      try {
        let newProfile;
        let { data } = await Axios.get(
          `${dbBaseURL}/${mainState.user.userId}/schedule`,
          // { cancelToken: ourRequest.token }
        );
        // console.log("oldSchedule==>", data);
        if (today === new Date(data.date).toDateString()) {
          //setProfile(data);
        } else {
          const newSchedule = data.schedule.map((med) => {
            med.taken = false;
            delete med._id;
            return med;
          });
          newProfile = {
            ...data,
            schedule: newSchedule,
          };
          delete newProfile.date;
          delete newProfile._id;
          // delete newProfile.__v;

          //console.log("newProfile==>", newProfile);

          data = await Axios.post(
            `${dbBaseURL}/${mainState.user.userId}/renewSchedule`,
            newProfile,
          );
        }
        mainDispatch({ type: "addToSchedule", data });

        // { cancelToken: ourRequest.token }

        // set(response.data);

        // setIsLoading(false);
      } catch (e) {
        // if (Axios.isCancel(e)) {
        //   console.log('Request canceled', e.message);
        // } else {
        //   console.log(e);
        // }
        console.log(e);
      }
    };
    fetchMeds();
    // return () => {
    //   ourRequest.cancel();
    // };
  }, []);

  // if (isLoading) return <LoadingDotsIcon />;
  if (!profile.schedule) return <>Loading...</>;
  return (
    <>
      <div className="not-taken flex flex-grow flex-col gap-2 overflow-hidden px-4 py-8">
        {profile.schedule.length > 0 &&
          profile.schedule.map((medListItem, idx) => {
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
          })}
      </div>

      <div className="taken flex flex-grow flex-col gap-2 overflow-hidden px-4 py-8">
        {profile.schedule.length > 0 &&
          profile.schedule.map((medListItem, idx) => {
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
          })}
      </div>
      <div>
        <button
          onClick={() => setIsAddMedModalOpen(true)}
          className="flex items-center justify-center space-x-3 rounded-lg border-2 border-secondary bg-pink-200 px-5 py-3 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-opacity-30 hover:shadow-lg"
        >
          Add a new medication
        </button>
      </div>
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
  const [medArray, setMedArray] = useState([]);
  const [selected, setSelected] = useState();
  const [times, setTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

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

    console.log("data (payload)==>", data);
    closeFn();

    try {
      const url = dbBaseURL + "/addToSchedule";
      const response = await Axios.post(url, data);

      mainDispatch({ type: "addToSchedule", data: response.data });
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
