const mongoose=require("mongoose");
// how to create a model
// step 1: require mongoose
// step 2: create mongoose schema(structure of a user)
// step 3: create a model
const Songs=new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    thumbnail: {
        type: String,
        require: true,
    },
    track: {
        type: String,
        require:true,
    },
    artist:{
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
});
const SongsModel=mongoose.model("Song",Songs);


module.exports = SongsModel;