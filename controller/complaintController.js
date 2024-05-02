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

const api_all_complaints = async (req, res) => {
  try {
    let userId = req.userId;
    let { searchQuery, page = 1 } = req.body;
    let query = {};

    console.log("req.body", req.body)
    let limit = 10;
    let filter = null;
    // query.citizenId = { $ne: userId };
    // Applying search query if provided
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    // Applying filter if provided
    if (filter) {
      if (filter.status) {
        query.status = filter.status;
      }
      if (filter.category) {
        query.category = filter.category;
      }
    }

    // Fetching complaints with pagination, sorting by createdAt
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit).populate('citizenId');

      console.log("complaints", complaints)

    res.json({
      status: "Success",
      complaints: complaints
    });

  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const api_my_complaints = async (req, res) => {
  try {
    let userId = req.userId;
    let { searchQuery, filter, page = 1, limit = 10 } = req.body;
    let query = {};

    query.citizenId = userId;
    // Applying search query if provided
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    // Applying filter if provided
    if (filter) {
      if (filter.status) {
        query.status = filter.status;
      }
      if (filter.category) {
        query.category = filter.category;
      }
    }

    // Fetching complaints with pagination, sorting by createdAt
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(complaints);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




module.exports = {
  create_new_complaint,
  delete_all_complaints,
  api_all_complaints,
  api_my_complaints
}