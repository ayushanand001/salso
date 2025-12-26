exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") res.render("salonDashboard");// Render admin dashboard 
  else res.redirect("/salons");
};
