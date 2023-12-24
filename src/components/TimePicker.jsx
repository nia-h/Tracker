import React, { useRef, useState } from "react";

const TimePicker = ({ i, handleTimePicker, times }) => {
  const pickerRef = useRef();
  const [pickerFocus, setPickerFocus] = useState(true);
  return (
    <div className="mr-2 mt-2 flex flex-col items-start">
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
        onChange={(e) => handleTimePicker(e, i)}
        type="time"
        disabled={i >= times}
        onBlur={() => setPickerFocus(false)}
        onFocus={() => setPickerFocus(true)}
        ref={pickerRef}
      ></input>
      <div
        className={`relative mt-0 ${
          i >= times || pickerFocus || pickerRef.current?.value.trim()
            ? "hidden"
            : ""
        }`}
      >
        <div className="upwardArrow absolute z-20 -translate-y-[var(--tooltipArrow-size)] translate-x-[50%] border-[length:var(--tooltipArrow-size)] border-transparent border-b-subtitle"></div>
        <div className="absolute w-[max-content] translate-y-[calc(var(--tooltipArrow-size))] rounded-[.3em] bg-subtitle p-[.5em] text-center text-[0.5rem] text-white ">
          Please pick a time for dose#{i + 1}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
