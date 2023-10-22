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

  //const { userId } = useParams();
  // const [isLoading, setIsLoading] = useState(true);
  const [medList, setMedList] = useState([]);
  const dbBaseURL = import.meta.env.VITE_dbBaseURL;
  const [controlTime, setControlTime] = useState(new Date());

  const delay = delayMs =>
    new Promise(resolve => {
      setTimeout(resolve, delayMs);
    });

  const setIntervalAsync = (fn, ms) => {
    fn().then(() => {
      setTimeout(() => setIntervalAsync(fn, ms), ms);
    });
  };

  useEffect(() => {
    setIntervalAsync(async () => {
      setControlTime(new Date());
      await delay(2000);
    }, 2000);
  }, []);

  // setInterval(setControlTime(new Date().getTime()), 2000);

  useEffect(() => {
    console.log(controlTime);
  }, [controlTime]);

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

  // if (isLoading) return <LoadingDotsIcon />;
  let list = [];
  for (let medListItem of medList) {
    list.push(<Med medListItem={medListItem} />);
  }

  {
    medList.length > 0 &&
      medList.map(medListItem => {
        return <Med medListItem={medListItem.med} key={medListItem._id} />;
      });
  }

  //   <div className='list-group'>
  //     {meds.length > 0 &&
  //       meds.map(post => {
  //         return <Med med={med} key={med._id} />;
  //       })}
  //     {meds.length == 0 && appState.user.email == email && (
  //       <p className='lead text-muted text-center'>
  //         You haven&rsquo;t created any meds yet;{' '}
  //         <Link to='/create-post'>create one now!</Link>
  //       </p>
  //     )}
  //     {meds.length == 0 && appState.user.email != email && (
  //       <p className='lead text-muted text-center'>
  //         {email} hasn&rsquo;t created any meds yet.
  //       </p>
  //     )}
  //   </div>
  // );
};

export default MedList;
