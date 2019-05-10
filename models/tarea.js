const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tareaSchema = new Schema({
  id: Number,
  description: String,
  status: String,
  date: Date
});

const Tarea = mongoose.model('Task',tareaSchema);

module.exports = Tarea;
