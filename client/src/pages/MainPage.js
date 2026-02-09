import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LatestArticles from '../components/LatestArticles';
import QuestionOfTheDay from '../components/QuestionOfTheDay';
import ChampionsOfSociology from '../components/ChampionsOfSociology';
import AboutSite from '../components/AboutSite';
import CircularSlider from '../components/CircularSlider';
import TopPicks from '../components/TopPicks';
import Footer from '../components/Footer';
import '../styles/MainPage.css';

function MainPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('latest-articles');
  const [articles, setArticles] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchArticles();
    fetchImages();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const handleArticleUpdate = () => {
    fetchArticles();
  };

  const tabs = [
    { id: 'latest-articles', label: 'Latest Articles', color: '#e74c3c' },
    { id: 'question-of-the-day', label: 'Question of the Day', color: '#f39c12' },
    { id: 'champions-of-sociology', label: 'Champions of Sociology', color: '#27ae60' },
    { id: 'about-site', label: 'About Site', color: '#3498db' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'latest-articles':
        return <LatestArticles user={user} articles={articles} onArticleUpdate={handleArticleUpdate} />;
      case 'question-of-the-day':
        return <QuestionOfTheDay user={user} />;
      case 'champions-of-sociology':
        return <ChampionsOfSociology />;
      case 'about-site':
        return <AboutSite user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="main-page">
      <header className="header">
        <h1 className="site-title">Queen of Science</h1>
        <div className="user-info">
          <span>Welcome, {user.uniqueId} ({user.userType})</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            style={{ color: tab.color }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="slider-section">
        <CircularSlider images={images} />
      </div>

      <div className="content">
        <div className="tab-content">
          {renderTabContent()}
        </div>

        <div className="top-picks-section">
          <TopPicks articles={articles} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MainPage;
