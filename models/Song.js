const mongoose=require("mongoose");
// how to create a model
// step 1: require mongoose
// step 2: create mongoose schema(structure of a user)
// step 3: create a model
const Songs=new mongoose.Schema({
    name:{
        type : String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required:true,
    },
    artist:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

Songs.index({ name: "text" });

const SongsModel=mongoose.model("Song",Songs);


SongsModel.collection.createIndex({ name: "text" })
    .then(() => {
        console.log("Text index created on 'name' field");
    })
    .catch((err) => {
        console.error("Error creating text index:", err);
    });


module.exports = SongsModel;