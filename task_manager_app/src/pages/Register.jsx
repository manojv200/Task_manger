import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
 
});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
     e.preventDefault();
    try {
      const response = await fetch('http://localhost:8002/task/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(response)
        navigate('/signin');
      } else {
        const data = await response.json();
        alert(data.detail || 'Registration failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    console.log('Register:', formData);
  };

  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        <input
          type="text"
          name="first_name"
          placeholder="FirstName"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

                <input
          type="text"
          name="last_name"
          placeholder="LastName"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

                <input
          type="text"
          name="mobile_no"
          placeholder="Mobile No"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />



        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-blue-600 signin transition-transform duration-300 hover:rotate-6 cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
