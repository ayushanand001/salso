exports.isAdmin = (req, res, next) => {
  // Allow both admin and owner to access the owner/admin salon dashboard
  if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
    return next();
  }
  return res.redirect("/salons");
};
