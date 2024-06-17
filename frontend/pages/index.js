import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [roast, setRoast] = useState('');
  const [error, setError] = useState('');

  // Function to fetch GitHub profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/profile/${username}`);
      setProfile(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to fetch profile. Make sure the username is correct and the server is running.');
      setProfile(null); // Clear previous profile data
    }
  };

  // Function to generate roast
  const generateRoast = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/roast/${username}`);
      setRoast(response.data.roast);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to generate roast. Please try again.');
      setRoast(''); // Clear previous roast
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GitHub Roast App</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        style={{ marginRight: '10px' }}
      />
      <button onClick={fetchProfile} style={{ marginRight: '10px' }}>Fetch Profile</button>
      <button onClick={generateRoast}>Generate Roast</button>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {profile && (
        <div style={{ marginTop: '20px' }}>
          <h2>Profile:</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {roast && (
        <div style={{ marginTop: '20px' }}>
          <h2>Roast:</h2>
          <p>{roast}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
