const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  page: String,
  admin: Boolean,
  moderator: Boolean,
  trainer: Boolean,
});
const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
