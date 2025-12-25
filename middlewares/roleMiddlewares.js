<<<<<<< HEAD
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin")
    //jaha jaha admin hai waha usko salonowner samjho
    next();
  else res.status(403).send("Access denied. Admins only.");
};
=======



exports.isAdmin=(req,res,next)=>{
    if(req.user.role==="admin")
       res.render("salonDashboard");
   
    else
        res.redirect("/salons");
    }
>>>>>>> 8c8b37ce8026c89ec3c7df01151e891f97ee82d8
