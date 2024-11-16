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
        const songs = await Song.find({ artist: req.user._id });
        return res.status(200).json({ data: songs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "get/mysong error" });
    }
});

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
router.get("/get/songname/:songName",
    passport.authenticate("jwt", {session:false}),
    async (req,res) =>{
        try{

            const {songName}= req.params;


            const songs = await Song.find({name: songName})
            return res.status(200).json({data: songs});

        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "get/name error" });
        }
    }
);

module.exports = router;
