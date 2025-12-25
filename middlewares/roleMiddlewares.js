exports.isAdmin=(req,res,next)=>{
    if(req.user.role==="admin")
       res.render("salonDashboard");
   
    else
        res.redirect("/salons");
    }
