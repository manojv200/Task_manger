import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8002/task/login/',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),

        })
        if (response.ok) {
            const data = await response.json();
            console.log(data)
        navigate('/dashboard', {
            state : {
   access_token :data.access_token,
   refresh_token :data.refresh_token
  }
        });
      } else {
        const data = await response.json();
        alert(data.detail || 'Registration failed');
      }
    }
    
    catch (err) {
      alert('Error: ' + err.message);
    }

    console.log('Sign In:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        
        <input
          type="email"
          name="username"
          placeholder="username"
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

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded">
          Sign In
        </button>
        <p className="mt-4 text-center">
  Don't have an account?{' '}
  <button
    type="button"
    onClick={() => navigate('/register')}
    className="text-blue-600 signin transition-transform duration-300 hover:rotate-6 cursor-pointer"
  >
    Register
  </button>
</p>

      </form>
    </div>
  );
};

export default Login;
