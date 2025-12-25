


exports.isAdmin=(req,res,next)=>{
    if(req.user.role==="admin")//jaha jaha admin hai waha usko salonowner samjho
        next();
   
    else
        res.status(403).send("Access denied. Admins only.");
    }
