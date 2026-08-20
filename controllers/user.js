import {prisma} from "../lib/prisma.js"


async function getAllUsers(req,res,next) {
    try{

        const users = await prisma.user.findMany()
        return res.json({data:users})

    }catch(err){
       next(err)
    }
   
}

async function getOneUser(req,res,next){
    const {userId} = req.params
    try{
        const user = await prisma.user.findUnique({
            where: {id:userId}
        })
        if(!user) return res.json({message:'User not Found!'})
        
        return res.json({data:user})

    }catch(err){
       next(err)
    }
}

async function getUserComments(req, res, next) {
  const { userId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { authorId:userId },
    });
   
    return res.json({ data: comments });
  } catch (err) {
    next(err);
  }
}

async function getUserPosts(req, res, next) {
  const { userId } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: { authorId:userId },
    });
   
    return res.json({ data: posts });
  } catch (err) {
    next(err);
  }
}


// Helper Check User function

async function checkIfUserExists(userId,res){
    // Check if user exists
    try{
        const checkUser = await prisma.user.findUnique({
            where:{id:userId}
        })
        if(!checkUser) return res.json({message: 'User not found!'})
        return checkUser

    }catch(err){
        throw err
    }
}



// createUser is handled in my authentication flow already

async function updateUser(req,res,next){
   const {userId} = req.params
   const checkUser =  await checkIfUserExists(userId,res)

   const {email,name,role,pwd,verified} = req.body

    // TODO:: HASH PASSWORD IF NECESSARY

    try{
        const user = await prisma.user.update({
            where: {id:userId},
            data: {
                email: email || checkUser.email,
                name:name || checkUser.name,
                role: role || checkUser.role,
                pwd: pwd || checkUser.pwd,
                verified: verified || checkUser.verified
            }
        })

        return res.json({data:user, message: 'User updated with success!'})

    }catch(err){
        next(err)
    }
}


async function deleteUser(req,res,next){
   const {userId} = req.params
   const checkUser =  await checkIfUserExists(userId,res)

   try{
    await prisma.user.delete({
        where:{id:userId}
    })
    return res.json({message: 'User deleted with success', data:checkUser})

   }catch(err){
    next(err)
   }
}

export {getAllUsers, getOneUser, updateUser, deleteUser, getUserComments, getUserPosts}