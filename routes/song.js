const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

// Create a new song
router.post("/create",
     passport.authenticate("jwt", { session: false }), 
     async (req, res) => {
    try {
        const { name, thumbnail, track } = req.body;

        // Validate input
        if (!name || !thumbnail || !track) {
            return res
            .status(400)
            .json({ error: "Insufficient details of song" });
        }

        const artist = req.user._id;
        const songDetails = { name, thumbnail, track, artist };

        // Create song in the database
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong); // 201 for resource creation
    } catch (error) {
        console.error(error);
       return res.status(500).json({ error: "create eerror" });
    }
});

// Get songs created by the current user
router.get("/get/mysongs",
     passport.authenticate("jwt", { session: false }),
      async (req, res) => {
    try {
        // Fetch user's songs
        const songs = await Song.find({ artist: req.user._id }).populate("artist");
        return res.status(200).json({ data: songs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "get/mysong error" });
    }
});


router.get("/get/allsongs", 
    passport.authenticate("jwt", { session: false }), 
    async (req, res) => {
        try {
            // Fetch all songs from the database
            const songs = await Song.find().populate("artist");
            
            // Return all songs
            return res.status(200).json({ data: songs });
        } catch (error) {
            console.error("Error fetching all songs:", error);
            return res.status(500).json({ error: "Error fetching all songs" });
        }
    }
);

// to get songs by artist
router.get("/get/artist/:artistId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) =>{
        try{

            const {artistId}= req.params;

            const artist= await User.findOne({_id: artistId});
            if(!artist){
                return res.status(301).json({err: "Artist does not exits"});
            }

            const songs = await Song.find({artist: artistId})
            return res.status(200).json({data: songs});

        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "get/artist error" });
        }
    }
);


// find song by name
// later we will use pattern search using mongodb  
router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const { songName } = req.params;

            // Use regex for fuzzy search and case-insensitive matching
            const songs = await Song.find({
                name: { $regex: songName, $options: "i" }, // "i" for case-insensitive
            }).populate("artist");

            // Return the matched songs
            return res.status(200).json({ data: songs });
        } catch (error) {
            console.error("Error during song search:", error);
            return res.status(500).json({ error: "Error retrieving songs" });
        }
    }
);


module.exports = router;
