const Complaint = require("../models/complaint");

const create_new_complaint = async (req, res) => {
  try {
    let userId = req.userId;
    const { title, type, description, latitude, longitude, address, pincode } = req.body;
    let mediaUrl = "";
    if(req.file)
    {
      mediaUrl = "public/media/"+req.file.filename;
    }
    console.log("req.file", req.file);
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
      media: mediaUrl,
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

const delete_all_complaints = async (req, res) => {
  try {
    await Complaint.deleteMany({});
    res.send({
      status: "success",
      message: "deleted all complaints"
    })
  }
  catch(error) {
    console.log("error", error);
    res.send(error);
  }
}


module.exports = {
  create_new_complaint,
  delete_all_complaints
}