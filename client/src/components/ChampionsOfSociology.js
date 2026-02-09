import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChampionsOfSociology.css';

function ChampionsOfSociology() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  return (
    <div className="champions-of-sociology">
      <h2>Champions of Sociology</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>College</th>
            <th>ID Name</th>
            <th>Article Count</th>
            <th>Response Count</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.uniqueId} className={index < 10 ? 'top-ten' : ''}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.college}</td>
              <td><em>{user.uniqueId}</em></td>
              <td>{user.articleCount}</td>
              <td>{user.responseCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChampionsOfSociology;
