// import React, { Component } from 'react'
import loading from './giphy.gif';
const Spinner=()=>  {
    return (
      <div className='d-flex justify-content-center'>
        <img className='my-10' src={loading} alt="loading" />
      </div>
    )
}

export default Spinner
