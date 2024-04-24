const Complaint = require("../models/complaint");

const create_new_complaint = async (req, res) => {
  try {
    let userId = req.userId;
    const { title, type, description, latitude, longitude, address, pincode } = req.body;
    var mediaFiles = new Array();
    for (var i = 0; i < req.files.length; i++) {
      mediaFiles[i] = "media/" + req.files[i].filename;
    }

    const newComplaint  = new Complaint({
      citizenId: userId,
      title: title, 
      status: 'Not Viewed',
      type: type,
      description: description,
      locationInfo: {
        latitude: latitude,
        longitude: longitude,
        address: address,
        pincode: pincode
      },
      media: mediaFiles,
      isActive: true
    })

    let data = await newComplaint.save();

    res.send({
      status: true,
      message: "Complaint Created Successfully",
      data
    });
  }
  catch(error) {
    console.log("error", error);
    res.send(error);
  }
}



module.exports = {
  create_new_complaint
}