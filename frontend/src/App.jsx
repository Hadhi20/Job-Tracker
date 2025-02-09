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

  const [errors, setErrors] = useState({}); // Holds validation errors

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

  const validateForm = () => {
    let errors = {};
    if (!formData.company_name.trim()) errors.company_name = "Company Name is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.application_status) errors.application_status = "Status is required";
    if (!formData.follow_up_date) {
      errors.follow_up_date = "Follow-Up Date is required";
    } else {
      const selectedDate = new Date(formData.follow_up_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time for accurate comparison
      if (selectedDate < today) errors.follow_up_date = "Follow-Up Date cannot be in the past";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails
    await axios.post('/api/jobs', formData);
    setFormData({ company_name: '', role: '', application_status: '', follow_up_date: '' }); // Clear form after submission
    setErrors({});
    fetchJobs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/jobs/${id}`);
    fetchJobs();
  };

  return (
    <div className="container">
      <h1 className="text-center mb-5 mt-4 fw-bold">Job Application <span className='text-danger'>Tracker</span></h1>

      {/* Add Job Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-3">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
              value={formData.company_name}
              onChange={handleInputChange}
            />
            {errors.company_name && <div className="text-warning">{errors.company_name}</div>}
          </div>

          <div className="col-12 col-md-3">
            <input
              type="text"
              name="role"
              placeholder="Role"
              className={`form-control ${errors.role ? 'is-invalid' : ''}`}
              value={formData.role}
              onChange={handleInputChange}
            />
            {errors.role && <div className="text-warning">{errors.role}</div>}
          </div>

          <div className="col-12 col-md-3">
            <select
              name="application_status"
              className={`form-select ${errors.application_status ? 'is-invalid' : ''}`}
              value={formData.application_status}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
            {errors.application_status && <div className="text-warning">{errors.application_status}</div>}
          </div>

          <div className="col-12 col-md-3">
            <input
              type="date"
              name="follow_up_date"
              className={`form-control ${errors.follow_up_date ? 'is-invalid' : ''}`}
              value={formData.follow_up_date}
              onChange={handleInputChange}
            />
            {errors.follow_up_date && <div className="text-warning">{errors.follow_up_date}</div>}
          </div>
        </div>

        <div className="mt-3 col-12 col-md-2">
          <button type="submit" className="btn btn-primary w-100">Add Job</button>
        </div>
      </form>

      {/* Job List */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className='table-danger'>
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
            {jobs.map((job, index) => {
              const formattedDate = job.follow_up_date
                ? new Date(job.follow_up_date).toLocaleDateString("en-GB") // Shows DD/MM/YYYY
                : "N/A";

              return (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{job.company_name}</td>
                  <td>{job.role}</td>
                  <td>{job.application_status}</td>
                  <td>{formattedDate}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
