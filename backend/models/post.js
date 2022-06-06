const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

//mongoose also need schema along with the model
//model is created using the schema we created
module.exports = mongoose.model('Post', postSchema);
