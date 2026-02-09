import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AboutSite.css';

const AboutSite = () => {
  const [adminData, setAdminData] = useState({
    rules: '',
    regulations: '',
    ownership: ''
  });
  const [exportedFiles, setExportedFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchExportedFiles();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/api/admin/data');
      setAdminData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  const fetchExportedFiles = async () => {
    try {
      const response = await axios.get('/api/export/files');
      setExportedFiles(response.data.files);
    } catch (error) {
      console.error('Failed to fetch exported files');
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/admin/data', adminData);
      setIsEditing(false);
      alert('Changes saved successfully!');
    } catch (error) {
      alert('Failed to save changes');
    }
  };

  const handleChange = (field, value) => {
    setAdminData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async (type, format) => {
    setExportLoading(true);
    try {
      const response = await axios.post(`/api/export/${type}/${format}`);
      alert(response.data.message);
      fetchExportedFiles(); // Refresh the file list
    } catch (error) {
      alert('Export failed: ' + error.response?.data?.message || 'Unknown error');
    }
    setExportLoading(false);
  };

  const handleDownload = (filename) => {
    window.open(`/api/export/download/${filename}`, '_blank');
  };

  const handleDeleteFile = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await axios.delete(`/api/export/files/${filename}`);
        alert('File deleted successfully');
        fetchExportedFiles();
      } catch (error) {
        alert('Failed to delete file');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="about-site">
      <h2>About Site Administration</h2>

      <div className="admin-controls">
        <button
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Content'}
        </button>

        {isEditing && (
          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="admin-content">
        <div className="content-section">
          <h3>Rules and Regulations</h3>
          {isEditing ? (
            <textarea
              value={adminData.rules}
              onChange={(e) => handleChange('rules', e.target.value)}
              rows="6"
              placeholder="Enter rules and regulations..."
            />
          ) : (
            <p>{adminData.rules}</p>
          )}
        </div>

        <div className="content-section">
          <h3>Regulations</h3>
          {isEditing ? (
            <textarea
              value={adminData.regulations}
              onChange={(e) => handleChange('regulations', e.target.value)}
              rows="6"
              placeholder="Enter additional regulations..."
            />
          ) : (
            <p>{adminData.regulations}</p>
          )}
        </div>

        <div className="content-section">
          <h3>Site Ownership</h3>
          {isEditing ? (
            <textarea
              value={adminData.ownership}
              onChange={(e) => handleChange('ownership', e.target.value)}
              rows="4"
              placeholder="Enter ownership information..."
            />
          ) : (
            <p>{adminData.ownership}</p>
          )}
        </div>
      </div>

      <div className="export-section">
        <h3>Data Export System</h3>
        <p>Export all user-uploaded data to your computer in various formats:</p>

        <div className="export-buttons">
          <div className="export-group">
            <h4>Articles Data</h4>
            <button
              className="export-btn pdf"
              onClick={() => handleExport('articles', 'pdf')}
              disabled={exportLoading}
            >
              Export Articles to PDF
            </button>
            <button
              className="export-btn excel"
              onClick={() => handleExport('articles', 'excel')}
              disabled={exportLoading}
            >
              Export Articles to Excel
            </button>
            <button
              className="export-btn word"
              onClick={() => handleExport('articles', 'word')}
              disabled={exportLoading}
            >
              Export Articles to Word
            </button>
          </div>

          <div className="export-group">
            <h4>Questions Data</h4>
            <button
              className="export-btn pdf"
              onClick={() => handleExport('questions', 'pdf')}
              disabled={exportLoading}
            >
              Export Questions to PDF
            </button>
            <button
              className="export-btn excel"
              onClick={() => handleExport('questions', 'excel')}
              disabled={exportLoading}
            >
              Export Questions to Excel
            </button>
          </div>

          <div className="export-group">
            <h4>Users Data</h4>
            <button
              className="export-btn excel"
              onClick={() => handleExport('users', 'excel')}
              disabled={exportLoading}
            >
              Export Users to Excel
            </button>
          </div>
        </div>

        {exportLoading && <div className="export-loading">Generating export file...</div>}

        <div className="exported-files">
          <h4>Exported Files</h4>
          {exportedFiles.length === 0 ? (
            <p>No exported files yet.</p>
          ) : (
            <div className="files-list">
              {exportedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">
                      {new Date(file.created).toLocaleString()}
                    </span>
                  </div>
                  <div className="file-actions">
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(file.name)}
                    >
                      Download
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteFile(file.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSite;
