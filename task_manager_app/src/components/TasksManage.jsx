import {React ,useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import AddTaskModal from './Addtask'


const TasksManage =(props) => {

  const [tasks, setTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([])
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    fetchTasks();
  }, [props.accessToken]);

    const handleAddTask = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

        const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8002/task/tasks/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.accessToken}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          const data = await response.json();
          setTasks(data)
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSave = async (taskData) => {
    console.log('Saving task:', taskData);
    try {
        const response = await fetch('http://localhost:8002/task/create_task/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.accessToken}`
          },
          body:JSON.stringify(taskData)
        });

        if (response.ok) {
          const data = await response.json();
          setLoading(false);
        setShowModal(false);
        alert(data.message)
           fetchTasks();
            } else {
          const data = await response.json();
          setCreatedTasks(data)
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
        setShowModal(false);
      }
  };   


  if (tasks.data?.errors){
  return(
    <div>
  <p className="text-2xl front-bold mb-6 text-center">{tasks.data?.errors} Please 
    <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-blue-600 signin transition-transform duration-300 hover:rotate-6 cursor-pointer"
          >
            Sign In
          </button>
          again
  </p>
  </div>
  )
}
else{
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
                 <div className="flex justify-end mb-4 mt-10">
  <button
    onClick={handleAddTask}
    className="bg-lightblue-600 text-black hover:text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow cursor-pointer "
  >
    Add New Task
  </button>
</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 hover:scale-110 cursor-pointer" onClick={() =>
            navigate('/datatable', {
              state:{ status:'pending',
                name:'Pending',
                accessToken:props.accessToken
              }
            })
          }>Full Tasks</h2>
          <p className="text-gray-600">You have {tasks.total_tasks} tasks</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-green-600 hover:scale-110 cursor-pointer" onClick={() =>
          navigate('/datatable', {
            state: { status: 'completed',
              name:'Completed',
              accessToken:props.accessToken
             },
          })
        }>Completed Tasks</h2>
          <p className="text-gray-600">{tasks.completed_tasks} tasks completed</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-yellow-600 hover:scale-110 cursor-pointer" onClick={() =>
            navigate('/datatable', {
              state:{ status:'pending',
                name:'Pending',
                accessToken:props.accessToken
              }
            })
          }>Pending Tasks</h2>
          <p className="text-gray-600">{tasks.pending_tasks} tasks pending</p>
        </div>
      </div>
            <AddTaskModal isOpen={showModal} onClose={handleClose} onSave={handleSave} />

    </div>
  );
  
}
};
export default TasksManage;