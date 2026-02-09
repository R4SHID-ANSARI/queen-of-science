import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CircularSlider.css';

function CircularSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', image: null });

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('image', formData.image);
    uploadData.append('description', formData.description);

    try {
      await axios.post('/api/images', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ description: '', image: null });
      setShowUploadForm(false);
      // Refresh images - this would need to be passed down from parent
      window.location.reload(); // Temporary solution
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  if (images.length === 0) {
    return (
      <div className="circular-slider">
        <div className="slider-placeholder">
          <p>No images uploaded yet.</p>
          <button onClick={() => setShowUploadForm(true)}>Upload First Image</button>
        </div>

        {showUploadForm && (
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              required
            />
            <input
              type="text"
              placeholder="Image description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <button type="submit">Upload</button>
            <button type="button" onClick={() => setShowUploadForm(false)}>Cancel</button>
          </form>
        )}
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="circular-slider">
      <div className="slider-container">
        <div className="slider-circle">
          <img
            src={`http://localhost:5000/api/images/file/${currentImage.filename}`}
            alt={currentImage.originalName}
            className="slider-image"
          />
          <div className="image-description">
            <em>{currentImage.description}</em>
          </div>
        </div>

        <div className="slider-controls">
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)}
          >
            ‹
          </button>
          <span>{currentIndex + 1} / {images.length}</span>
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
          >
            ›
          </button>
        </div>
      </div>

      <button onClick={() => setShowUploadForm(!showUploadForm)} className="upload-btn">
        {showUploadForm ? 'Cancel Upload' : 'Upload Image'}
      </button>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            required
          />
          <input
            type="text"
            placeholder="Image description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit">Upload</button>
          <button type="button" onClick={() => setShowUploadForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default CircularSlider;
