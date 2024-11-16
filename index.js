
const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
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
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false); // Optionally, you could create a new account here
        }
    } catch (err) {
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
