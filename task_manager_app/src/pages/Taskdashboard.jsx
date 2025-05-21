import React from 'react'
import Datatable from '../components/Datatable'
import { useLocation } from 'react-router-dom'

const Taskdashboard = () => {
  const location = useLocation();
  const {status, name, accessToken} = location.state || {};
  return (
    <div>
      <Datatable accessToken={accessToken} name={name} status={status}/></div>
  )
}

export default Taskdashboard