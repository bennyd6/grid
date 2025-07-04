import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For resume upload
import { motion, AnimatePresence } from 'framer-motion'; // For modal animations
import { FaFileUpload, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Icons

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedDataFromUpload = location.state?.parsedData; // Data from Home page resume upload

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: [''],
    achievements: [''],
    projects: [{ title: '', description: '', link: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    experience: [{ company: '', title: '', duration: '', description: '' }],
  });

  const [loading, setLoading] = useState(true); // Set to true initially for data fetch
  const [saving, setSaving] = useState(false); // For save portfolio button
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Function to fetch existing portfolio data
  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/myportfolio', {
        headers: { 'auth-token': token },
      });

      if (!response.ok) {
        // If portfolio not found, it's okay, user can create new one
        if (response.status === 404) {
          console.log("No existing portfolio found, starting fresh.");
          setForm({ // Reset form to initial empty state
            name: '', email: '', phone: '', summary: '',
            skills: [''], achievements: [''],
            projects: [{ title: '', description: '', link: '' }],
            education: [{ degree: '', institution: '', year: '' }],
            experience: [{ company: '', title: '', duration: '', description: '' }],
          });
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch portfolio');
      }

      const data = await response.json();
      // Populate form with fetched data, ensuring arrays have at least one empty string/object if empty
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        summary: data.summary || '',
        skills: data.skills && data.skills.length > 0 ? data.skills : [''],
        achievements: data.achievements && data.achievements.length > 0 ? data.achievements : [''],
        projects: data.projects && data.projects.length > 0 ? data.projects : [{ title: '', description: '', link: '' }],
        education: data.education && data.education.length > 0 ? data.education : [{ degree: '', institution: '', year: '' }],
        experience: data.experience && data.experience.length > 0 ? data.experience : [{ company: '', title: '', duration: '', description: '' }],
      });
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parsedDataFromUpload) {
      // If data came from resume upload, use it to pre-fill the form
      setForm({
        name: parsedDataFromUpload.name || '',
        email: parsedDataFromUpload.email || '',
        phone: parsedDataFromUpload.phone || '',
        summary: parsedDataFromUpload.summary || '',
        skills: parsedDataFromUpload.skills && parsedDataFromUpload.skills.length > 0 ? parsedDataFromUpload.skills : [''],
        achievements: parsedDataFromUpload.achievements && parsedDataFromUpload.achievements.length > 0 ? parsedDataFromUpload.achievements : [''],
        projects: parsedDataFromUpload.projects && parsedDataFromUpload.projects.length > 0 ? parsedDataFromUpload.projects : [{ title: '', description: '', link: '' }],
        education: parsedDataFromUpload.education && parsedDataFromUpload.education.length > 0 ? parsedDataFromUpload.education : [{ degree: '', institution: '', year: '' }],
        experience: parsedDataFromUpload.experience && parsedDataFromUpload.experience.length > 0 ? parsedDataFromUpload.experience : [{ company: '', title: '', duration: '', description: '' }],
      });
      setLoading(false); // No need to fetch if data is provided
    } else {
      // Otherwise, fetch from backend
      fetchPortfolio();
    }
  }, [parsedDataFromUpload]); // Dependency on parsedDataFromUpload


  const handleChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleArrayChange = (e, field, index, subfield = null) => {
    const updated = [...form[field]];
    if (subfield) {
      updated[index][subfield] = e.target.value;
    } else {
      updated[index] = e.target.value;
    }
    setForm({ ...form, [field]: updated });
  };

  const addField = (field, template) => {
    setForm({ ...form, [field]: [...form[field], template] });
  };

  const removeField = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    // Ensure there's always at least one empty field if array becomes empty (for UX)
    if (updated.length === 0 && (field === 'skills' || field === 'achievements')) {
      setForm({ ...form, [field]: [''] });
    } else if (updated.length === 0 && (field === 'projects' || field === 'education' || field === 'experience')) {
      setForm({ ...form, [field]: [{}] }); // Use empty object for object arrays
    } else {
      setForm({ ...form, [field]: updated });
    }
  };

  const sectionTitle = (title) => (
    <h2 className="text-2xl font-bold text-gray-200 border-b border-gray-600 pb-3 mb-6">{title}</h2>
  );

  const inputField = (label, value, onChange, placeholder = '', isTextArea = false, rows = 4) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      {isTextArea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
        />
      )}
    </div>
  );

  // Cleaning function to remove empty strings and empty objects
  const cleanData = (data) => {
    const isEmptyString = (str) => typeof str !== 'string' || str.trim() === '';

    const cleanStringArray = (arr) => arr.filter((item) => !isEmptyString(item));

    const cleanObjectArray = (arr) =>
      arr.filter((obj) =>
        obj && Object.values(obj).some((val) => !isEmptyString(val))
      );

    return {
      name: data.name.trim() || undefined,
      email: data.email.trim() || undefined,
      phone: data.phone.trim() || undefined,
      summary: data.summary.trim() || undefined,
      skills: cleanStringArray(data.skills),
      achievements: cleanStringArray(data.achievements),
      projects: cleanObjectArray(data.projects),
      education: cleanObjectArray(data.education),
      experience: cleanObjectArray(data.experience),
    };
  };

  const savePortfolio = async () => {
    setSaving(true); // Use saving state for the button
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const cleanedForm = cleanData(form);

      const response = await fetch('http://localhost:3000/api/auth/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(cleanedForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save portfolio');
      }

      const data = await response.json();
      console.log('Portfolio saved:', data);

      navigate('/templates'); // No need to pass state, templates fetch their own
    } catch (err) {
      console.error('savePortfolio error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Resume Upload Handlers (for inline upload on Details page)
  const handleResumeFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null); // Clear previous errors
  };

  const handleResumeUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file before uploading.');
      return;
    }

    setUploadingResume(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await axios.post('http://localhost:3000/upload', formData);
      const parsedData = res.data?.parsedData;

      if (parsedData) {
        // Merge parsed data with current form state, prioritizing parsed data
        setForm(prevForm => ({
          ...prevForm,
          name: parsedData.name || prevForm.name,
          email: parsedData.email || prevForm.email,
          phone: parsedData.phone || prevForm.phone,
          summary: parsedData.summary || prevForm.summary,
          skills: parsedData.skills && parsedData.skills.length > 0 ? parsedData.skills : prevForm.skills,
          achievements: parsedData.achievements && parsedData.achievements.length > 0 ? parsedData.achievements : prevForm.achievements,
          projects: parsedData.projects && parsedData.projects.length > 0 ? parsedData.projects : prevForm.projects,
          education: parsedData.education && parsedData.education.length > 0 ? parsedData.education : prevForm.education,
          experience: parsedData.experience && parsedData.experience.length > 0 ? parsedData.experience : prevForm.experience,
        }));
        setShowUploadModal(false); // Close modal after successful upload
        setSelectedFile(null); // Clear selected file
      } else {
        setUploadError("No data parsed from resume. Please check file format.");
      }
    } catch (err) {
      console.error('Resume upload failed:', err);
      setUploadError('Resume upload failed. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-300">Loading portfolio details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10 font-inter">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl space-y-8 border border-gray-700">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-8">
          Edit Your Portfolio
        </h1>

        {/* Upload Resume Section */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 flex flex-col items-center justify-center text-center">
          <FaFileUpload className="text-5xl text-orange-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-100 mb-3">Quick Start: Upload Resume</h2>
          <p className="text-gray-300 mb-6">Let us automatically extract information from your resume to pre-fill the form.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg
                       hover:bg-orange-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400"
          >
            <FaFileUpload />
            <span>Upload Resume</span>
          </button>
        </div>

        {/* Personal Info */}
        <div>
          {sectionTitle('Personal Information')}
          {inputField('Full Name', form.name, (e) => handleChange(e, 'name'))}
          {inputField('Email Address', form.email, (e) => handleChange(e, 'email'))}
          {inputField('Phone Number', form.phone, (e) => handleChange(e, 'phone'))}
          {inputField('Professional Summary', form.summary, (e) => handleChange(e, 'summary'), '', true, 5)}
        </div>

        {/* Skills */}
        <div>
          {sectionTitle('Skills')}
          {form.skills.map((skill, idx) => (
            <div key={`skill-${idx}`} className="flex items-center mb-4">
              {inputField(`Skill ${idx + 1}`, skill, (e) => handleArrayChange(e, 'skills', idx), 'e.g., React, Node.js')}
              {form.skills.length > 1 && (
                <button
                  onClick={() => removeField('skills', idx)}
                  className="ml-3 p-3 text-red-400 hover:text-red-600 transition-colors duration-200"
                  title="Remove Skill"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium"
            onClick={() => addField('skills', '')}
          >
            <FaPlus className="text-xs" /> <span>Add Skill</span>
          </button>
        </div>

        {/* Achievements */}
        <div>
          {sectionTitle('Achievements')}
          {form.achievements.map((ach, idx) => (
            <div key={`ach-${idx}`} className="flex items-center mb-4">
              {inputField(`Achievement ${idx + 1}`, ach, e => handleArrayChange(e, 'achievements', idx), 'e.g., Awarded "Employee of the Year"')}
              {form.achievements.length > 1 && (
                <button
                  onClick={() => removeField('achievements', idx)}
                  className="ml-3 p-3 text-red-400 hover:text-red-600 transition-colors duration-200"
                  title="Remove Achievement"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium"
            onClick={() => addField('achievements', '')}
          >
            <FaPlus className="text-xs" /> <span>Add Achievement</span>
          </button>
        </div>

        {/* Projects */}
        <div>
          {sectionTitle('Projects')}
          {form.projects.map((proj, idx) => (
            <div key={idx} className="mb-6 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Project {idx + 1}</h3>
                {form.projects.length > 1 && (
                  <button
                    onClick={() => removeField('projects', idx)}
                    className="text-red-400 hover:text-red-600 transition-colors duration-200"
                    title="Remove Project"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
              {inputField('Title', proj.title, (e) => handleArrayChange(e, 'projects', idx, 'title'))}
              {inputField('Description', proj.description, (e) => handleArrayChange(e, 'projects', idx, 'description'), '', true, 3)}
              {inputField('Link', proj.link, (e) => handleArrayChange(e, 'projects', idx, 'link'), 'e.g., https://github.com/myproject')}
            </div>
          ))}
          <button
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium"
            onClick={() => addField('projects', { title: '', description: '', link: '' })}
          >
            <FaPlus className="text-xs" /> <span>Add Project</span>
          </button>
        </div>

        {/* Education */}
        <div>
          {sectionTitle('Education')}
          {form.education.map((edu, idx) => (
            <div key={idx} className="mb-6 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Education {idx + 1}</h3>
                {form.education.length > 1 && (
                  <button
                    onClick={() => removeField('education', idx)}
                    className="text-red-400 hover:text-red-600 transition-colors duration-200"
                    title="Remove Education"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
              {inputField('Degree/Field', edu.degree, (e) => handleArrayChange(e, 'education', idx, 'degree'))}
              {inputField('Institution', edu.institution, (e) => handleArrayChange(e, 'education', idx, 'institution'))}
              {inputField('Year', edu.year, (e) => handleArrayChange(e, 'education', idx, 'year'), 'e.g., 2020-2024 or 2024')}
            </div>
          ))}
          <button
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium"
            onClick={() => addField('education', { degree: '', institution: '', year: '' })}
          >
            <FaPlus className="text-xs" /> <span>Add Education</span>
          </button>
        </div>

        {/* Experience */}
        <div>
          {sectionTitle('Experience')}
          {form.experience.map((exp, idx) => (
            <div key={idx} className="mb-6 p-6 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Experience {idx + 1}</h3>
                {form.experience.length > 1 && (
                  <button
                    onClick={() => removeField('experience', idx)}
                    className="text-red-400 hover:text-red-600 transition-colors duration-200"
                    title="Remove Experience"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
              {inputField('Company', exp.company, (e) => handleArrayChange(e, 'experience', idx, 'company'))}
              {inputField('Title/Role', exp.title, (e) => handleArrayChange(e, 'experience', idx, 'title'))}
              {inputField('Duration', exp.duration, (e) => handleArrayChange(e, 'experience', idx, 'duration'), 'e.g., Jan 2022 - Dec 2023')}
              {inputField('Description', exp.description, (e) => handleArrayChange(e, 'experience', idx, 'description'), '', true, 3)}
            </div>
          ))}
          <button
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium"
            onClick={() => addField('experience', { company: '', title: '', duration: '', description: '' })}
          >
            <FaPlus className="text-xs" /> <span>Add Experience</span>
          </button>
        </div>

        <div className="pt-6">
          {error && <p className="mb-4 text-red-500 font-medium text-center">{error}</p>}
          <button
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition duration-300 ${
              saving ? 'bg-gray-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
            }`}
            onClick={savePortfolio}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save & View Templates'}
          </button>
        </div>
      </div>

      {/* Upload Resume Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-gray-100 shadow-2xl border border-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Upload Your Resume</h2>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeFileChange}
                className="mb-6 w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
              {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => { setShowUploadModal(false); setSelectedFile(null); setUploadError(null); }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResumeUploadSubmit}
                  className={`px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors duration-200 font-semibold shadow-md ${uploadingResume ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={uploadingResume}
                >
                  {uploadingResume ? 'Uploading...' : 'Upload & Parse'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Details;
