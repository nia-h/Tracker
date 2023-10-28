import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { StateContext, DispatchContext } from '../Contexts';
// import LoadingDotsIcon from './LoadingDotsIcon';
// import StateContext from '../StateContext';
import Med from './Med';
import _, { set } from 'lodash';
import CreateEntry from './CreateEntry';

const abortController = new AbortController();

const MedList = props => {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);
  console.log('mainState==>', mainState);

  // console.log('userId==>', userId);

  // const [isLoading, setIsLoading] = useState(true);
  // const [medList, set] = useState([]);
  // const [profile, setProfile] = useState({});
  const dbBaseURL = import.meta.env.VITE_dbBaseURL;
  // const [controlTime, setControlTime] = useState(new Date());
  const profile = mainState.profile;
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

    const nextSchedule = profile.schedule.map((med, i) => {
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
    //set(nextMedList);
    try {
      const url = dbBaseURL + '/checkItem';
      const { data } = await Axios.post(
        url,
        {
          userId: mainState.user.userId,
          nextSchedule,
        }
        // { signal: abortController.signal }
      );
      // console.log('response==>', response);
      // setProfile(data);
      mainDispatch({ type: 'addToSchedule', data });
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
      const today = new Date().toDateString();
      console.log('today==>', today);
      try {
        let newProfile;
        let { data } = await Axios.get(
          `${dbBaseURL}/${mainState.user.userId}/schedule`
          // { cancelToken: ourRequest.token }
        );
        console.log('oldSchedule==>', data);
        if (today === new Date(data.date).toDateString()) {
          //setProfile(data);
        } else {
          console.log('data==>', data);
          const newSchedule = data.schedule.map(med => {
            med.taken = false;
            delete med._id;
            return med;
          });
          console.log('newSchedule==>', newSchedule);
          newProfile = {
            ...data,
            schedule: newSchedule,
          };
          delete newProfile.date;
          delete newProfile._id;
          // delete newProfile.__v;

          console.log('newProfile==>', newProfile);

          data = await Axios.post(
            `${dbBaseURL}/${mainState.user.userId}/renewSchedule`,
            newProfile
          );
        }
        mainDispatch({ type: 'addToSchedule', data });

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
  if (!profile.schedule) return <>testing</>;
  return (
    <>
      <div>
        <div>
          <div className='bg-red-100 rounded-2xl px-4 py-8 my-4 not-taken'>
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
          {''}

          <div className='bg-gray-200 rounded-2xl px-4 py-8 my-2 taken'>
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
        </div>
      </div>
      <div>
        <CreateEntry />
      </div>
    </>
  );
};

export default MedList;
