exports.isAdmin=(req,res,next)=>{
    if(req.user.role==="admin")
        next();
   
    else
            router.get("/salons", verifyToken, salonController.getAllSalons);
    }
