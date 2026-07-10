const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const callbackURL =
  process.env.GITHUB_CALLBACK_URL || `http://localhost:${PORT}/api/auth/github/callback`;

app.use(cors());
app.use(express.json());

// Simple session (required for Passport OAuth flows)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

let users = []; // In-memory database

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id) || null;
  done(null, user);
});

// GitHub OAuth Logic
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      let user = users.find((u) => u.githubId === String(profile.id));
      if (!user) {
        const email =
          profile.emails?.[0]?.value || profile.username || `${profile.id}@github.local`;
        user = {
          id: Date.now(),
          email,
          githubId: String(profile.id),
          name: profile.displayName || profile.username,
        };
        users.push(user);
      }
      return done(null, user);
    }
  )
);

// Signup Route (Matches Lovable AI mock)
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: "Welcome! Signup successful.", userId: newUser.id });
});

// Login Route (Matches Lovable AI mock)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "secret");
  res.json({ message: "Welcome Back!", token, user: { email: user.email } });
});

// ===== GitHub OAuth Routes =====
app.get(
  "/api/auth/github",
  (req, res, next) => {
    console.log('GitHub auth start: /api/auth/github');
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {
    console.log('GitHub auth handler returned after passport.authenticate');
    res.end();
  }
);

app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/api/auth/github/failure" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );
    res.json({
      success: true,
      message: "GitHub login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  }
);

app.get("/api/auth/github/failure", (req, res) => {
  res.status(401).json({ success: false, message: "GitHub authentication failed" });
});

// Middleware to protect routes using Passport session authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
}

// Protected profile route using Passport session
app.get('/api/auth/profile', ensureAuthenticated, (req, res) => {
  const user = req.user;
  res.json({ success: true, user: { id: user.id, email: user.email } });
});

app.listen(PORT, () => console.log(`Auth API running on http://localhost:${PORT}`));