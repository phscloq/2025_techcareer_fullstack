import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No blog title provided"],
    trim: true,
    minlength: [5, "Minimum 5 characters required for blog title"],
    maxlength: [100, "Maximum 100 characters allowed for blog title"],
  },
  content: {
    type: String,
    required: [true, "No blog content provided"],
    trim: true,
    minlength: [5, "Minimum 5 characters required for blog content"],
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    validate: {
      validator: function (v: string[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "At least one tag is required",
    },
  },
  dateInformation: {
    type: String, default: Date.now(),
},
views: {
  type: Number, default: 0, min: [0, "Views cannot be negative"],
},
status: {
  type: String, enum: ["draft", "published"], default: "draft",
},
  
}, {
  timestamps: true,
});

postSchema.virtual("summary").get(function () {
  return this.content.substring(0, 100) + "..."; // İlk 100 karakter ve ardından ...
});


postSchema.pre("save", function (next) {
  this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
  next();
});


postSchema.statics.findByAuthor = function (authorName) {
  return this.find({author: authorName});
};


postSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Sanal alanların JSON'a dahil edilmesi
postSchema.set("toJSON", {virtuals: true});


const Post = mongoose.model('Post', postSchema);

export default Post;
