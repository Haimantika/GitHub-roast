require("dotenv").config();
const express = require("express");
const axios = require("axios");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const session = require("express-session");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "replace_this_with_a_secure_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://github-roast.up.railway.app/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Route to serve the login page
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

// Route to handle GitHub authentication
app.get("/auth/github", passport.authenticate("github"));

// GitHub callback route
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => res.redirect("/home")
);

// Protected route to serve the homepage after login
app.get("/home", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "home.html"));
  } else {
    res.redirect("/");
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_NEW3,
});

// Endpoint to generate a roast
app.get("/roast/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const githubResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const profileData = githubResponse.data;

    if (!profileData)
      return res.status(404).json({ error: "GitHub user not found" });

    const messages = [
      {
        role: "system",
        content:
          "You are a witty assistant asked to create a light-hearted roast.",
      },
      {
        role: "user",
        content: `Tell me a roast about a GitHub user named ${
          profileData.name || username
        } who has ${profileData.public_repos} repositories and ${
          profileData.followers
        } followers.`,
      },
    ];

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    if (completion.choices && completion.choices.length > 0) {
      const roast = completion.choices[0].message.content;
      res.json({ roast });
    } else {
      res.status(500).json({ error: "Failed to generate a roast from AI" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch data or generate roast" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
