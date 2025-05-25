const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  fileUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalFileName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
