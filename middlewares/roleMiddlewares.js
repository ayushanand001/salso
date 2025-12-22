exports.isAdmin=(req,res,next)=>{
    if(req.session.user.role==="admin")
        next();
    else
            res.send("access denied")
    }
