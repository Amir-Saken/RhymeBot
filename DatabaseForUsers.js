const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/t_bot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const usersSchema = new Schema({
    chatId: Number,
    name: String,
    permission: Boolean,
    created: {
        type: Date,
        default: Date.now()
    }
})

usersSchema.permission = true;

const users = mongoose.model('users', usersSchema);
module.exports = users;