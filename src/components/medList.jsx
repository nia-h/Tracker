import React, { useEffect, useState, useContext } from 'react';
import Axios, { AbortController } from 'axios';
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

  const userId = mainState.userId;
  console.log('userId==>', userId);

  //const { userId } = useParams();
  // const [isLoading, setIsLoading] = useState(true);
  const [medList, setMedList] = useState([]);
  const dbBaseURL = import.meta.env.VITE_dbBaseURL;
  const [controlTime, setControlTime] = useState(new Date());
  // const [medsTaken, setMedsTaken] = useState([]);
  const [currentItemId, setCurrentItemId] = useState('');

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
        console.log('clicked med==>', med);
        return {
          ...med,
          taken: !med.taken,
        };
      }
    });
    // Re-render with the new array

    setMedList(nextMedList);

    setCurrentItemId(e.target.id);
    // console.log('userId==>', userId);
  };

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        // const response = await Axios.get(`/${email}/meds`, {
        const response = await Axios.get(
          `${dbBaseURL}/${mainState.user.userId}/medlist`,
          { signal: abortController.signal }
        );
        setMedList(response.data.schedule);

        // setIsLoading(false);
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log('Request canceled', e.message);
        } else {
          console.log(e);
        }
      }
    };
    fetchMeds();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const checkItem = async () => {
      try {
        console.log('currentItemId==>', currentItemId);
        console.log('updated medList==>', medList);
        const itemId = currentItemId;

        const url = dbBaseURL + '/checkItem';
        const response = await Axios.post(
          url,
          {
            userId: '6532765eac2b082245ef8514',
            medList,
          },
          { signal: abortController.signal }
        );
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log('Request canceled', e.message);
        } else {
          console.log(e);
        }
      }
    };
    checkItem();
    return () => {
      abortController.abort();
    };
  }, [currentItemId]);
  // const ourRequest = Axios.CancelToken.source();

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

  // let list = [];
  // for (let medListItem of medList) {
  //   list.push(<Med medListItem={medListItem} />);
  // }
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
