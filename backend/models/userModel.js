import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['Admin', 'Team Manager', 'Member'],
    default: 'Member'
  },
  bio: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    default: ""
  },
  socialLinks: {
    type: Map,
    of: String,
    default: {}
  },
  timezone: {
    type: String,
    default: "UTC"
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  }
}, { timestamps: true });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;