require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { OpenAI, Completions, Chat } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// You can adjust `Completions` or `Chat` depending on which fits better according to the documentation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completions = new Completions(openai);

// Fetch GitHub Profile Data
app.get('/api/profile/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    res.status(500).json({ error: 'Error fetching GitHub profile' });
  }
});

// Generate Roast
app.get('/api/roast/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
    const profileData = profileResponse.data;
    const prompt = `Roast this GitHub profile: ${JSON.stringify(profileData)}`;

    const aiResponse = await completions.create({
      model: "text-davinci-004",
      prompt,
      max_tokens: 150,
    });

    res.json({ roast: aiResponse.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error generating roast:', error);
    res.status(500).json({ error: 'Error generating roast' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



