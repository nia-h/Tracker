import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { StateContext, DispatchContext } from '../Contexts';
// import LoadingDotsIcon from './LoadingDotsIcon';
// import StateContext from '../StateContext';
import Med from './Med';
import _, { set } from 'lodash';

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

  const delay = ms =>
    new Promise(resolve => {
      setTimeout(resolve, ms);
    });

  const handleCheck = async e => {
    e.preventDefault();
    console.log('e.target.id==>', e.target.id);
    const itemId = e.target.id;
    // setMedList(preMedList => {
    //   preMedList[idx].taken = true;
    //   return preMedList;
    // });
    // console.log('userId==>', userId);
    console.log('itemId==>', itemId);

    try {
      const url = dbBaseURL + '/checkItem';
      const response = await Axios.post(url, {
        userId: '6532765eac2b082245ef8514',
        itemId,
      });
      console.log('response==>', response);
    } catch (e) {
      console.log(e);
    }
  };

  // const setIntervalAsync = (fn, ms) => {
  //   fn().then(() => {
  //     setTimeout(() => setIntervalAsync(fn, ms), ms);
  //   });
  // };
  useEffect(() => {
    // const ourRequest = Axios.CancelToken.source();

    const fetchMeds = async () => {
      try {
        // const response = await Axios.get(`/${email}/meds`, {
        const response = await Axios.get(
          `${dbBaseURL}/${mainState.user.userId}/medlist`,
          {}
        );
        setMedList(response.data.schedule);

        // setIsLoading(false);
      } catch (e) {
        console.log('There was a problem.');
      }
    };
    fetchMeds();
    // return () => {
    //   ourRequest.cancel();
    // };
  }, []);

  // useEffect(() => {
  //   async function renewTime() {
  //     await delay(2000);
  //     setControlTime(new Date());
  //   }
  //   renewTime();
  // }, [controlTime]);

  // setInterval(setControlTime(new Date().getTime()), 2000);

  useEffect(() => {
    console.log('medList=>', medList);
  }, [medList]);

  // if (isLoading) return <LoadingDotsIcon />;

  // let list = [];
  // for (let medListItem of medList) {
  //   list.push(<Med medListItem={medListItem} />);
  // }
  return (
    <>
      <ul className='list-none not-taken'>
        {
          medList.length > 0 &&
            medList.map(medListItem => {
              console.log('medListItem._id==>', medListItem._id);
              if (medListItem.taken === false) {
                return (
                  <li className='bg-red-200' key={medListItem._id}>
                    <Med
                      medListItem={medListItem}
                      handleCheck={handleCheck}
                      key={medListItem._id}
                      // id={medListItem._id}
                    />
                  </li>
                );
              }
            })
          // .filter(med => {
          //   console.log(med);
          //   return;
          // })
        }
      </ul>
      {''}
      {''}
      {/* <ul className='list-none taken'>
        {medsTaken.length > 0 &&
          medsTaken.map(med, idx => {
            return (
              <li className='bg-red-200' key={med._id}>
                <Med idx={idx} med={med} key={med._id} />
              </li>
            );
          })}
      </ul> */}
    </>
  );
};

export default MedList;
