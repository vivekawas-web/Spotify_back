const mongoose=require("mongoose");
// how to create a model
// step 1: require mongoose
// step 2: create mongoose schema(structure of a user)
// step 3: create a model
const user=new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
        private:true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
    },
    likedSongs: {
        // we will change this to array
        type: String,
        default:"",
    },
    likedPlaylist: {
        // same as likedSongs
        type: String,
        default:"",
    }
});
const UserModel=mongoose.model("User",user);


module.exports = UserModel;