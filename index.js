
const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Passport JWT Configuration

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;  // Make sure the JWT secret is defined in .env

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // Ensure that the user id is in the JWT payload and lookup the user by _id
        const user = await User.findOne({ _id: jwt_payload.id });

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // Return the user if found
        return done(null, user);
    } catch (err) {
        // In case of errors like DB issues, pass the error
        console.error('Error in JWT strategy:', err);
        return done(err, false);
    }
}));


app.use(passport.initialize());

// API Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});


// Routes
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// Fallback Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
