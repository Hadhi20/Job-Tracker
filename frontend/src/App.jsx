import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    application_status: '',
    follow_up_date: ''
  });

  // Fetch jobs from the backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const response = await axios.get('/api/jobs');
    setJobs(response.data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/jobs', formData);
    fetchJobs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/jobs/${id}`);
    fetchJobs();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Job Application Tracker</h1>

      {/* Add Job Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              className="form-control"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="role"
              placeholder="Role"
              className="form-control"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="application_status"
              placeholder="Status"
              className="form-control"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="follow_up_date"
              className="form-control"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Add Job</button>
      </form>

      {/* Job List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Follow-Up</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.id}>
              <td>{index + 1}</td>
              <td>{job.company_name}</td>
              <td>{job.role}</td>
              <td>{job.application_status}</td>
              <td>{job.follow_up_date}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
