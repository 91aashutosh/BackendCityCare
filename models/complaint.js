const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    citizenId: { type: Schema.Types.ObjectId, ref: "Citizen" },
    status: { type: String },
    type: { type: String },
    description: { type: String },
    locationInfo: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    media: [{type: String}],
    dateAndTime: {
        type: Date,
        default: new Date()
    },
    isActive: { type: Boolean, default: true },
  });

  complaintSchema.set("timestamps", true);
  
  
  module.exports = mongoose.model("Complaint", complaintSchema);
  