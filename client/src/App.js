import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: '',
  });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage('');

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('position', formData.position);
    if (resume) data.append('resume', resume);

    try {
      const response = await axios.post('http://100.53.34.239:3000/api/apply', data);
      setMessage(response.data.message);
      setFormData({ fullName: '', email: '', position: '' });
      setResume(null);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage('Error submitting application');
      }
    }
  };

  return (
    <div className="App">
      <h1>Job Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Position:</label>
          <select name="position" value={formData.position} onChange={handleChange} required>
            <option value="">Select a position</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div>
          <label>Resume (PDF only):</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit Application</button>
      </form>
      {message && <p className="success">{message}</p>}
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((error, index) => (
            <li key={index}>{error.msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

