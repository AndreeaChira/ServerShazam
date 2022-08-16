const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    songs: [{
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        href: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    }],
    likedSongs: [{
        id: {
            type: Number,
            required: true
        },}],
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const User=mongoose.model('User',UserSchema);

module.exports=User;