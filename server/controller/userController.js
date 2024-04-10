const User = require("../models/userSchema");

exports.profile = async (req, res) => {
    try {
        if(req.isAuthenticated()){
            const user = await User.findById(req.user._id)
            res.json(user)
        } else {
            res.json("user not logged in");
        }

    } catch (error) {
      return res.status(500).send(error);
    }
  };

exports.user = async(req, res) => {
    try{
        if(req.isAuthenticated()){
            const user = await User.findById(req.params.userId)
            res.json(user)
        } else {
            res.json("user not logged in");
        }
    }catch (error) {
      return res.status(500).send(error);
    }
}

exports.details = async(req, res) => {
    try{
        if(req.isAuthenticated()){
            const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
                new: true, // To return the updated document
              });

              res.json({success:true})
    
        } else {
            res.json("user not logged in");
        }
    }catch (error) {
      return res.status(500).send(error);
    }
}
