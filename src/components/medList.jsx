import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { StateContext, DispatchContext } from '../Contexts';
// import LoadingDotsIcon from './LoadingDotsIcon';
// import StateContext from '../StateContext';
import Med from './Med';
import _, { set } from 'lodash';

const abortController = new AbortController();

const MedList = props => {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  // console.log('userId==>', userId);

  // const [isLoading, setIsLoading] = useState(true);
  const [medList, setMedList] = useState([]);
  const dbBaseURL = import.meta.env.VITE_dbBaseURL;
  const [controlTime, setControlTime] = useState(new Date());

  // const delay = ms =>
  //   new Promise(resolve => {
  //     setTimeout(resolve, ms);
  //   });

  const handleCheck = async e => {
    e.preventDefault();
    // console.log('e.target.id==>', e.target.id);
    //const itemId = e.target.id;
    const idx = e.target.name;
    console.log('idx==>', idx);

    const nextMedList = medList.map((med, i) => {
      console.log('i==>', i);
      if (i !== +idx) {
        // No change
        return med;
      } else {
        return {
          ...med,
          taken: !med.taken,
        };
      }
    });
    // Re-render with the new array
    setMedList(nextMedList);
    try {
      const url = dbBaseURL + '/checkItem';
      const response = await Axios.post(
        url,
        {
          userId: mainState.user.userId,
          medList,
        }
        // { signal: abortController.signal }
      );
      console.log('response==>', response);
    } catch (e) {
      // if (Axios.isCancel(e)) {
      //   console.log('Request canceled', e.message);
      // } else {
      //   console.log(e);
      // }
      console.log(e);
    }

    // setCurrentItemId(e.target.id);
  };

  useEffect(() => {
    // const ourRequest = Axios.CancelToken.source();

    const fetchMeds = async () => {
      try {
        // const response = await Axios.get(`/${email}/meds`, {
        const response = await Axios.get(
          `${dbBaseURL}/${mainState.user.userId}/medlist`
          // { cancelToken: ourRequest.token }
        );
        setMedList(response.data.schedule);

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

  // useEffect(() => {
  //   const checkItem = async () => {

  //   };
  //   checkItem();
  //   // return () => {
  //   //   abortController.abort();
  //   // };
  // }, [medList]);

  // const setIntervalAsync = (fn, ms) => {
  //   fn().then(() => {
  //     setTimeout(() => setIntervalAsync(fn, ms), ms);
  //   });
  // };

  // useEffect(() => {
  //   async function renewTime() {
  //     await delay(2000);
  //     setControlTime(new Date());
  //   }
  //   renewTime();
  // }, [controlTime]);

  // setInterval(setControlTime(new Date().getTime()), 2000);

  // useEffect(() => {
  //   console.log('medList=>', medList);
  // }, [medList]);

  // if (isLoading) return <LoadingDotsIcon />;

  return (
    <>
      <div className='not-taken'>
        {medList.length > 0 &&
          medList.map((medListItem, idx) => {
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
      {''}
      {''}
      <div className='taken'>
        {medList.length > 0 &&
          medList.map((medListItem, idx) => {
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
    </>
  );
};

export default MedList;
