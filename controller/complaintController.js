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
    let { searchQuery, page } = req.body;
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

      let lastPage;
      if(complaints.length < 10)
      {
        lastPage = -1;
      }
      else
      {
        lastPage = page+1;
      }

      console.log("complaints", complaints)

    res.status(200).json({
      status: "Success",
      lastPage: lastPage,
      complaints: complaints,
    });

  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const api_my_complaints = async (req, res) => {
  try {
    let userId = req.userId;
    let { searchQuery, page } = req.body;
    let query = {};

    let limit = 10;

    query.citizenId = userId;
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    // if (filter) {
    //   if (filter.status) {
    //     query.status = filter.status;
    //   }
    //   if (filter.category) {
    //     query.category = filter.category;
    //   }
    // }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

      let lastPage;
      if(complaints.length < 10)
      {
        lastPage = -1;
      }
      else
      {
        lastPage = page+1;
      }

      res.status(200).json({
        status: "Success",
        lastPage: lastPage,
        complaints: complaints,
      });

  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const api_all_complaints_organization = async (req, res) => {
  try{
    let userId = req.userId;
    let { searchQuery, category } = req.body;
    let query = {};

    query.type = category;

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })

      res.status(200).json({
        status: "Success",
        complaints: complaints,
      });    
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

const api_all_complaints_organizationById = async (req, res) => {
  try{
    let complaintId = req.params.id;
    const complaint = await Complaint.findOne({_id: complaintId}).populate('citizenId')

    if(!complaint)
    {
      res.status(404).json({
        "status": false,
        "message": "no complaint found"
      })
    }

      res.status(200).json({
        status: "Success",
        complaint: complaint,
      });    
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

const api_update_status = async (req, res) => {
  try {
    let { status, message, complaintId } = req.body;

    let data = await Complaint.findOneAndUpdate({ _id: complaintId }, { $set: { status: status, message: message }});

    res.status(200).json({
      "status": true,
      "message": "status and message updated successfully"
    })

  }
  catch(error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

const all_complaints_coordinates = async (req, res) => {
  try{
    let allComplaints = await Complaint.find({}).select({ locationInfo: 1, type: 1 });
    res.status(200).json({
      status: true,
      allComplaints: allComplaints,
    })
  }
  catch(error) {
    console.log("error", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}




module.exports = {
  create_new_complaint,
  delete_all_complaints,
  api_all_complaints,
  api_my_complaints,
  api_all_complaints_organization,
  api_all_complaints_organizationById,
  api_update_status,
  all_complaints_coordinates
}