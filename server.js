require('dotenv').config();
const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_NEW2,
});

app.get('/roast/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const githubResponse = await axios.get(`https://api.github.com/users/${username}`);
    const profileData = githubResponse.data;

    if (!profileData) {
      return res.status(404).json({ error: "GitHub user not found" });
    }

    const messages = [
      { "role": "system", "content": "You are a witty assistant asked to create a light-hearted roast." },
      { "role": "user", "content": `Tell me a roast about a GitHub user named ${profileData.name || username} who has ${profileData.public_repos} repositories and ${profileData.followers} followers.` },
    ];

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      const roast = completion.choices[0].message.content;
      res.json({ roast });
    } else {
      console.error('No choices found in the response:', completion);
      res.status(500).json({ error: "Failed to generate a roast from AI" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data or generate roast' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






