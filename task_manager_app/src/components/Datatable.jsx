import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Datatable = (props) => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [res, setRes] = useState("");
  console.log("drsdgybjjvhfuyuyvvf");
  console.log("Access Token:", props.accessToken);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (props.status != "") {
          const response = await fetch(
            `http://localhost:8002/task/tasks/?status=${props.status || ""}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.accessToken}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setTasks(data);
            console.log(data)
          } else {
            setRes(data?.data?.errors || "Something went wrong");
          }
        } else {
          const response = await fetch(
            `http://localhost:8002/task/tasks/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.accessToken}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setTasks(data);
          } else {
            setRes(data?.data?.errors || "Something went wrong");
          }
        }
      } catch (error) {
        setRes("Network error");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [props.accessToken]);
  console.log(res);
  if (res) {
    return (
      <div>
        <p className="text-2xl front-bold mb-6 text-center">
          {res} Please
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="text-blue-600 signin transition-transform duration-300 hover:rotate-6 cursor-pointer"
          >
            Sign In
          </button>
          again
        </p>
      </div>
    );
  } else {
    if (tasks.tasks_count == 0) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            No Tasks available
          </h1>
        </div>
      );
    } else {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {props.name} Task List
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-2 px-4 border-b">Title</th>
                  <th className="text-left py-2 px-4 border-b">Description</th>
                  <th className="text-left py-2 px-4 border-b">Due Date</th>
                  <th className="text-left py-2 px-4 border-b">Priority</th>
                  <th className="text-left py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.data?.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{task.title}</td>
                    <td className="py-2 px-4 border-b">{task.description}</td>
                    <td className="py-2 px-4 border-b">{task.due_date}</td>
                    <td className="py-2 px-4 border-b">{task.priority}</td>
                    <td className="py-2 px-4 border-b">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
};

export default Datatable;
