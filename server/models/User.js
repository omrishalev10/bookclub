const mongoose = require('mongoose');
const Schema = mongoose.Schema;  

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  favoriteBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  favoriteSubjects: [{ type: String }]
});


module.exports = mongoose.model('User', userSchema);