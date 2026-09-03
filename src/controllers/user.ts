import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";
import { type Request, type Response, type NextFunction } from "express";
import { Role } from "../generated/prisma/index.js";
import {UserUpdateValidator, UserRoleValidator} from "../validation/validators.js"
interface userParams {
  userId: string;
}

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      omit: {
        pwd: true,
      },
    });
    return res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

async function getOneUser(
  req: Request<userParams>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ error: "You are not logged in" });
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId) && req.user.role !== Role.ADMIN)
    return res.status(403).json({ error: "You are not the user here" });
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      omit: {
        pwd: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not Found!" });

    return res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function getUserComments(
  req: Request<userParams>,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: parseInt(userId) },
    });

    return res.json({ data: comments });
  } catch (err) {
    next(err);
  }
}

async function getUserPosts(
  req: Request<userParams>,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: parseInt(userId) },
    });

    return res.json({ data: posts });
  } catch (err) {
    next(err);
  }
}

// Helper Check User function

async function checkIfUserExists(
  userId: number,
): Promise<boolean | Express.User> {
  // Check if user exists
  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) return false;
    return checkUser;
  } catch (err) {
    throw err;
  }
}

// createUser is handled in my authentication flow already
function validateUpdateUserData(
  req: Request<
    userParams,
    any,
    { email?: string; name?: string; password?: string }
  >,
  res: Response,
  next: NextFunction,
){
  const result  = UserUpdateValidator.safeParse(req.body)

  if(!result.success){
    return next(result.error)
  }else{
    req.body = result.data
    return next()
  }
  
}



async function updateUser(
  req: Request<
    userParams,
    any,
    { email?: string; name?: string; password?: string }
  >,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ error: "You are not logged in" });
  try {
    const { userId } = req.params;
    if (parseInt(userId) !== req.user.id)
      return res
        .status(403)
        .json({ error: "You are forbidden from changing this user's infos!" });
    const checkUser = await checkIfUserExists(parseInt(userId));
    if (typeof checkUser === "boolean")
      return res.status(404).json({ message: "User not found!" });

    const { email, name, password } = req.body;
    // TODO:: HASH PASSWORD IF NECESSARY
    let hashed;
    let data;
    const verified =
      email && checkUser.email !== email ? false : checkUser.verified;
    if (password) {
      hashed = await hashPassword(password);
      data = {
        email: email || checkUser.email,
        name: name || checkUser.name,
        pwd: hashed,
        verified,
      };
    } else {
      data = {
        email: email || checkUser.email,
        name: name || checkUser.name,
        verified,
      };
    }
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data,
    });

    return res.json({
      message: "User updated with success!",
    });
  } catch (err) {
    next(err);
  }
}

function validateUserRole(
  req: Request<
    userParams,
    any,
    { role: Role }
  >,
  res: Response,
  next: NextFunction,
){
  const result  = UserRoleValidator.safeParse(req.body)

  if(!result.success){
    return next(result.error)
  }else{
    req.body = result.data
    return next()
  }
  
}


async function updateRole(
  req: Request<userParams, any, { role: Role }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ error: "You are not logged in" });
  const { userId } = req.params;
  const checkUser = await checkIfUserExists(parseInt(userId));

  if (typeof checkUser === "boolean")
    return res.status(404).json({ message: "User not found!" });

  if (req.user.role !== Role.ADMIN)
    return res
      .status(403)
      .json({ error: "You are forbidden from changing this user's infos!" });

  const { role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        role: role,
      },
    });

    return res.json({
      data: { role: user.role },
      message: "User updated with success!",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(
  req: Request<userParams>,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;

  const checkUser = await checkIfUserExists(parseInt(userId));
  if (typeof checkUser === "boolean")
    return res.status(404).json({ message: "User not found!" });

  try {
    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });
    return res.json({
      message: "User deleted with success",
      data: { name: checkUser.name, email: checkUser.email },
    });
  } catch (err) {
    next(err);
  }
}

export {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserComments,
  getUserPosts,
  updateRole,
  validateUpdateUserData,
  validateUserRole
};
