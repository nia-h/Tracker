import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import Axios from 'axios';
import { conservatively } from '@grammarly/focal/dist/_cjs/src/utils';
const dbBaseURL = 'http://localhost:8081';
const medsBase = 'https://clinicaltables.nlm.nih.gov';

// function CreateEntry() {
//   const [medArray, setMedname] = useState();

//   async function handleLookup(value) {
//     if (!value.trim()) {
//       alert('You must provide a medication name!');
//       return;
//     } else {
//       const medInfo = await Axios.get('meds-lookup', { medName: value });
//       console.log('medInfo==>', medInfo);
//     }
//   }

//   // async function handleSubmit(e) {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await Axios.get('/meds-lookup');

//   //     setMedname(response);
//   //     // Redirect to new post url
//   //     appDispatch({
//   //       type: 'flashMessage',
//   //       value: 'Congrats, you created a new post.',
//   //     });
//   //     navigate(`/post/${response.data}`);
//   //     console.log('New post was created.');
//   //   } catch (e) {
//   //     console.log('There was a problem.');
//   //   }
//   // }

//   return (
//     <>
//       {/* <div>
//         name: <span>${medName}</span>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className='form-group'>
//           <label htmlFor='post-title' className='text-muted mb-1'>
//             <small>Name of medication</small>
//           </label> */}
//       <input
//         onChange={e => setMedname(e.target.value)}
//         onBlur={e => handleLookup()}
//         autoFocus
//         name='med-name'
//         id='med-name'
//         className='form-control form-control-lg form-control-title'
//         type='text'
//         placeholder=''
//         autoComplete='off'
//       />
//       {/* </div>

//         <div className='form-group'>
//           <label htmlFor='post-body' className='text-muted mb-1 d-block'>
//             <small>Body Content</small>
//           </label>
//           <textarea
//             onChange={e => setBody(e.target.value)}
//             name='body'
//             id='post-body'
//             className='body-content tall-textarea form-control'
//             type='text'></textarea>
//         </div>

//         <button className='btn btn-primary'>Save New Post</button>
//       </form> */}
//     </>
//   );
// }

// export default createEntry;

// import React, { useEffect } from 'react';

const CreateEntry = () => {
  const [medArray, setMedArray] = useState([]);
  const [selected, setSelected] = useState();
  const [times, setTimes] = useState(0);
  const [pickedTimes, setPickedTimes] = useState(new Array(5).fill(null));

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
        medsBase + `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;
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
    const entryInfo = {
      medication: selected,
      slots,
    };
    console.log('entryInfo==>', entryInfo);
    try {
      const url = dbBaseURL + '/create-entry';
      const response = await Axios.post(url, entryInfo);
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

// {const [medArray, setMedArray] = useState([]);
// const [selected, setSelected] = useState();

// async function handleLookup(medName) {
//   if (!medName.trim()) {
//     // alert('You must provide a medication name!');
//     return;
//   } else {
//     try {
//       const url =
//         medsBase +
//         `/api/rxterms/v3/search?terms=${medName}&ef=STRENGTHS_AND_FORMS`;
//       const { data } = await Axios.get(url);
//       console.log('data[1]==>', data[1]);
//       setMedArray(e => data[1]);
//       console.log('medArray==>', medArray);
//     } catch (e) {
//       console.log('err==>', e);
//     }
//   }
// }

// return (
//   <>
//     <input
//       // onChange={e => setMedname(e.target.value)}
//       onBlur={e => handleLookup(e.target.value)}
//       autoFocus
//       name='med-name'
//       id='med-name'
//       className='form-control form-control-lg form-control-title'
//       type='text'
//       placeholder=''
//       autoComplete='off'
//     />
//     <select
//       onChange={e => {
//         console.log('dropdown onChange==>', e.target, value);
//         setSelected(e.target.value);
//         console.log('selected==>', selected);
//       }}
//       defaultValue='default'>
//       <option value='default'>---</option>
//       {medArray.length > 0 &&
//         medArray.map(med => {
//           console.log('looped medArray');
//           console.log('array element==>', med);
//           return (
//             <option key={med} value={med}>
//               {med}
//             </option>
//           );
//         })}
//     </select>
//   </>
// );
//};

//export default CreateEntry;