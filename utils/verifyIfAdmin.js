function verifyIfAdmin(req,res,next){
  if(!req.user || req.user.role !=="ADMIN") return res.status(403).json({error: "You are not the admin!"})
  next()
}

export default verifyIfAdmin