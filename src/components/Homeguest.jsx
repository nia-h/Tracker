import React, { useState } from 'react';
//import Page from "./Page"
import Axios from 'axios';
const dbBaseURL = import.meta.env.VITE_dbBaseURL;
const medsBaseURL = import.meta.env.VITE_medsBaseURL;

function HomeGuest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data: user } = await Axios.post(`${dbBaseURL}/register`, {
        email,
        password,
      });
      console.log('user==>', user);
      if (user) {
        setEmail('');
        setPassword('');
      }
    } catch (e) {
      console.log('err==>', e);
    }
  }

  return (
    // <Page title="Welcome!" wide={true}>
    <div className='bg-blue-300'>
      <div className='col-lg-7 py-3 py-md-5'>
        <h1 className='display-3'>Meds Tracker</h1>
        <p className='lead text-muted'></p>
      </div>
      <div className='col-lg-5 pl-lg-5 pb-3 py-lg-5'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'></div>
          <div className='form-group'>
            <label htmlFor='email-register' className='text-muted mb-1'>
              <small>Email</small>
            </label>
            <input
              onChange={e => setEmail(e.target.value)}
              id='email-register'
              name='email'
              className='form-control'
              type='text'
              placeholder='you@example.com'
              autoComplete='off'
              value={email}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password-register' className='text-muted mb-1'>
              <small>Password</small>
            </label>
            <input
              onChange={e => setPassword(e.target.value)}
              id='password-register'
              name='password'
              className='form-control'
              type='password'
              placeholder='Create a password'
              value={password}
            />
          </div>
          <button type='submit' className=''>
            Sign up for Meds Tracker
          </button>
        </form>
      </div>
    </div>
    // </Page>
  );
}

export default HomeGuest;
