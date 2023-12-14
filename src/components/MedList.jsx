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

import { StateContext, DispatchContext } from "../Contexts";
// import LoadingDotsIcon from './LoadingDotsIcon';

import Med from "./Med.jsx";
import _ from "lodash";
import { Modal } from "./Modal.jsx";
import debounce from "lodash/debounce";
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
const dbBaseURL = import.meta.env.VITE_dbBaseURL;

import times from "lodash/fp/times.js";
const _times = times;
import { useDB } from "../context/useDB.jsx";
import LoadingDots from "./LoadingDots.jsx";

const MedList = () => {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  const schedule = mainState.schedule;
  const [isLoading, setIsLoading] = useState(true);

  const today = mainState.today;
  const userId = mainState.userId;
  const socialId = mainState.socialId;
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const { checkItem } = useDB();

  const sortedSchedule = useMemo(() => {
    const scheduleCopy = [...schedule];
    scheduleCopy.push({ hr: "completed" });

    const timeToNumber = (time) => parseFloat(time.replace(":", "."));

    return scheduleCopy.sort((a, b) => {
      if (a.hr && !b.hr && b.taken) {
        return -1;
      } else if (a.hr && !b.hr && !b.taken) {
        return 1;
      } else if (!a.hr && b.hr && b.taken) {
        return 1;
      } else if (!a.hr && b.hr && !b.taken) {
        return -1;
      } else if (!a.taken && !a.hr && b.hr) {
        return 1;
      } else if (a.taken && b.taken) {
        return 0;
      } else if (a.taken) {
        return 1;
      } else if (b.taken) {
        return -1;
      } else {
        return timeToNumber(a.time) - timeToNumber(b.time);
      }
    });
  }, [schedule]);

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

    mainDispatch({ type: "updateSchedule", data: nextSchedule });

    await checkItem(nextSchedule);
  }

  useEffect(() => {
    const controller = new AbortController();
    const abortSignal = controller.signal;

    const fetchSchedule = async () => {
      try {
        const url = dbBaseURL + `/${userId}/fetchSchedule`;
        const { data } = await Axios.get(url, {
          signal: abortSignal,
        });
        mainDispatch({ type: "updateSchedule", data });
        setIsLoading(false);
      } catch (e) {
        console.log("error==>", e);
      }
    };

    if (mainState.userId) fetchSchedule();

    return () => controller.abort();
  }, [mainState.userId]);

  if (isLoading) return <LoadingDots />;

  return (
    <>
      {!sortedSchedule[1] ? (
        <>
          <div
            onClick={() => setIsAddMedModalOpen(true)}
            className="cursor-pointer self-start font-bold text-accent hover:text-subtitle"
          >
            + Add a your first medication to start using Tracker
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => setIsAddMedModalOpen(true)}
            className="z-20 cursor-pointer self-start font-bold text-accent hover:text-subtitle"
          >
            + Add a new medication
          </div>
          <div className=" flex w-full appearance-none flex-col items-center justify-center  text-xl font-semibold">
            <div class="cloud1 absolute translate-x-[-50%] translate-y-[-50%] animate-cloud1">
              <img alt="" src="/images/cloud-2a.png" width="250" />
            </div>
            <div className="appearance-none text-primaryBlue">{today}</div>

            <div class="cloud2 absolute translate-x-[60%] translate-y-[20%] animate-cloud2">
              <img alt="" src="/images/cloud-3a.png" width="300" />
            </div>
          </div>
          <div className="schedule mx-[auto] mt-[-8rem] flex appearance-none flex-col gap-2 overflow-hidden px-4  md:w-[90%]">
            {sortedSchedule.map((course, idx) => {
              if (course.med) {
                return (
                  <Med
                    course={course} // needs refactor to simplify props
                    handleCheck={handleCheck}
                    key={course._id}
                    taken={course.taken}
                    id={course._id}
                    idx={idx}
                  />
                );
              } else {
                return (
                  <div
                    className={`${
                      sortedSchedule.some((course) => course.taken)
                        ? ""
                        : "invisible"
                    } self-start rounded-[1000px] bg-purple-400 px-2.5 py-1 font-[1rem]`}
                  >
                    completed:{" "}
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
      <AddMedFormModal
        isOpen={isAddMedModalOpen}
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
  const [isRequesting, setIsRequesting] = useState(false);
  const inputRef = useRef();
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  // const schedule = mainState.schedule;
  const today = mainState.today;
  const userId = mainState.userId;

  const { updateSchedule } = useDB();

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
    setIsRequesting(true);
    const slots = pickedTimes.slice(0, times);

    const addedCourses = [];

    slots.forEach((slot) => {
      addedCourses.push({ med: selectedMed, time: slot, taken: false });
    });

    closeFn();

    try {
      const data = await updateSchedule(userId, addedCourses);
      mainDispatch({
        type: "updateSchedule",
        data,
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
        <div className="text-lg font-medium">Add a new medication</div>
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
              disabled={isRequesting}
              type="submit"
              className="my-6 rounded-lg border border-orange bg-orange px-4 py-3 text-center text-white duration-200 hover:border-warm hover:bg-warm disabled:bg-blue-300"
            >
              Add
            </button>
          </div>
        </form>
      </Modal>
    )
  );
}

export default MedList;
