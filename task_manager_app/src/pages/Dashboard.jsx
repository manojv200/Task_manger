import React from 'react'
import TasksManage from '../components/TasksManage'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation();
  const {access_token, refresh_token} = location.state || {};
  console.log(access_token)
  const handleAddTask =() =>{
    console.log('add task')
  }
  return (
    <div>
      <TasksManage accessToken={access_token}/></div>
  )
}

export default Dashboard