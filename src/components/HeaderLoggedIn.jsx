import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// import ReactTooltip from 'react-tooltip';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;
import { useNavigate } from 'react-router-dom';
import { DispatchContext, StateContext } from '../Contexts';

function HeaderLoggedIn(props) {
  const mainDispatch = useContext(DispatchContext);
  const mainState = useContext(StateContext);

  function handleLogout() {
    mainDispatch({ type: 'logout' });
  }

  // function handleSearchIcon(e) {
  //   e.preventDefault();
  //   mainDispatch({ type: 'openSearch' });
  // }

  return (
    <div className='flex-row my-3 my-md-0'>
      {/* <a
        data-for='search'
        data-tip='Search'
        onClick={handleSearchIcon}
        href='#'
        className='text-white mr-2 header-search-icon'>
        <i className='fas fa-search'></i>
      </a>
      <ReactTooltip place='bottom' id='search' className='custom-tooltip' />{' '} */}
      {/* <span
        data-for='chat'
        data-tip='Chat'
        className='mr-2 header-chat-icon text-white'>
        <i className='fas fa-comment'></i>
        <span className='chat-count-badge text-white'> </span>
      </span>
      <ReactTooltip place='bottom' id='chat' className='custom-tooltip' />{' '}
      <Link
        data-for='profile'
        data-tip='My Profile'
        to={`/profile/${mainState.user.username}`}
        className='mr-2'>
        <img className='small-header-avatar' src={mainState.user.avatar} />
      </Link>
      <ReactTooltip place='bottom' id='profile' className='custom-tooltip' />{' '} */}
      <Link className='btn btn-sm btn-success mr-2' to='/create-entry'>
        Add a New Medication
      </Link>{' '}
      <button onClick={handleLogout} className='btn btn-sm btn-secondary'>
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;

// import React, { useState, useContext } from 'react';
// //import Page from "./Page"
// import Axios from 'axios';
//

// const HeaderLoggedOut = () => {
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   const navigate = useNavigate();
//   const mainDispatch = useContext(DispatchContext);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const { data: user } = await Axios.post(`${dbBaseURL}/login`, {
//         email,
//         password,
//       });
//       if (user) {
//         console.log('user==>', user);
//         mainDispatch({ type: 'login', data: user });
//       } else {
//         console.log('Incorrect username / password.');
//       }
//     } catch (e) {
//       console.log('err==>', e);
//     }

//     navigate('/');
//   };

//   return (
//     // <Page title="Welcome!" wide={true}>
//     <div className='row align-items-center'>
//       <div className='col-lg-7 py-3 py-md-5'>
//         <h1 className='display-3'>Log In</h1>
//         <p className='lead text-muted'></p>
//       </div>
//       <div className='col-lg-5 pl-lg-5 pb-3 py-lg-5'>
//         <form onSubmit={handleSubmit}>
//           <div className='form-group'></div>
//           <div className='form-group'>
//             <label htmlFor='email-register' className='text-muted mb-1'>
//               <small>Email</small>
//             </label>
//             <input
//               onChange={e => setEmail(e.target.value)}
//               id='email-register'
//               name='email'
//               className='form-control'
//               type='text'
//               placeholder='you@example.com'
//               autoComplete='off'
//             />
//           </div>
//           <div className='form-group'>
//             <label htmlFor='password-register' className='text-muted mb-1'>
//               <small>Password</small>
//             </label>
//             <input
//               onChange={e => setPassword(e.target.value)}
//               id='password-register'
//               name='password'
//               className='form-control'
//               type='password'
//               placeholder='Create a password'
//             />
//           </div>
//           <button
//             type='submit'
//             className='py-3 mt-4 btn btn-lg btn-success btn-block'>
//             Log In
//           </button>
//         </form>
//       </div>
//     </div>
//     // </Page>
//   );
// };

// export default HeaderLoggedOut;
