const mongoose=require("mongoose");
// how to create a model
// step 1: require mongoose
// step 2: create mongoose schema(structure of a user)
// step 3: create a model
const PlayList=new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    thumbnail: {
        type: String,
        require: true,
    }, 
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    songs:[
        {
        type: mongoose.Types.ObjectId,
        ref: "Song",
       },
    ],
    collaborators :[
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    ]
});
const PlayListModel=mongoose.model("Playlist",PlayList);


module.exports = PlayListModel;