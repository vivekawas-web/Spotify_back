const express = require("express");
const passport = require("passport");
const PlayListModel = require("../models/Playlist");
const router = express.Router();
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

// routes1 create a playlist
router.post("/create",
    passport.authenticate("jwt",{session:false}),

    async (req,res)=>{


        try{
            const currentUser= req.user;

            const {name,thumbnail,songs}= req.body;

            if(!name || !thumbnail || !songs){
                return res.status(301).json({err:"insufficient data"});
            }

            const playlistData= {name, thumbnail , songs, owner: currentUser._id, collaborators:[],

            };

            const playlist = await Playlist.create(playlistData)

            return res.status(200).json(playlist);


        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "routes playlist create error" });
        }
    }
);

// route2 get a playlist by id
// :playlistId can be anything
router.get("/get/playlist/:playlistId",
    passport.authenticate("jwt",{session:false}),
    async (req,res)=>{
        try{
            const playlistId= req.params.playlistId;

        const playlist= await Playlist.findOne({_id: playlistId});

        if(!playlist){
            return res.status(301).json({err:"Invalid Id"});
        }
        return res.status(200).json(playlist);

        }catch (error){
            console.error(error);
            return res.status(500).json({ error: "/get/playlist/:playlistId error" });
        }
        
    }
);



router.get(
    "/get/me",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const artistId = req.user._id;

        const playlists = await Playlist.find({owner: artistId}).populate(
            "owner"
        );
        return res.status(200).json({data: playlists});
    }
);

// get all playlist made by an artist

router.get("/get/artist/:aristId",
    passport.authenticate("jwt",{session:false}),
    async (req,res) =>{
        try{
            const artistId = req.params.aristId;

        const artist = await User.findOne({_id:artistId});
        if(!artist){
            return res.status(304).json({err:"Invalid Artist"});
        }

        const playlists = await Playlist.find({owner:artistId});
        return res.status(200).json({data:playlists});

        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "/get/artist/:aristId error" });
        }
    }
);

// add a song to playlist


router.post("/add/song",
    passport.authenticate("jwt",{session:false}),
    async (req,res)=>{
        try{

            const currentUser= req.user;
            const {playlistId, songId} = req.body;

            const playlist = await Playlist.findOne({_id:playlistId});
            if(!playlist){
                return res.status(304).json({err:"Playlist does not exits"});
            }

            if(!playlist.owner.equals(currentUser._id)  && !playlist.collaborators.includes(currentUser._id)){

                return res.status(400).json({err:"not allowed"});
            }

            const song = await Song.findOne({_id:songId});
            if(!song){
                return res.status(304).json({err:"Song does not exits"})
            }

            playlist.songs.push(songId);
            await playlist.save();


            return res.status(200).json(playlist);

        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "/add/song error" });
        }
    });

module.exports = router;