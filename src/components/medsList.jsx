import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import StateContext from '../StateContext';
import Post from './Post';

function MedList(props) {
  // const appState = useContext(StateContext);
  const { email } = useParams();
  // const [isLoading, setIsLoading] = useState(true);
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    // const ourRequest = Axios.CancelToken.source();

    const fetchMeds = async () => {
      try {
        const response = await Axios.get(`/${email}/meds`, {
          // cancelToken: ourRequest.token,
        });
        setMeds(response.data);
        // setIsLoading(false);
      } catch (e) {
        console.log('There was a problem.');
      }
    };
    fetchMeds();
    // return () => {
    //   ourRequest.cancel();
    // };
  }, [email]);

  // if (isLoading) return <LoadingDotsIcon />;
  console.log('meds==>', meds);
  return;
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
}

export default MedList;
