import * as z from "zod"
import {Role} from "../generated/prisma/index.js"

const UserValidator = z.object({
    name: z.string().trim().min(2,"You must enter your name!").normalize(),
    email: z.email("Email is invalid"),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/,{error: `Password must have at least 8 characters one lowercase letter, one uppercase letter, one number, one special character, and no spaces.`}),
    confirmPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/)
})

const UserUpdateValidator = z.object({
    name: z.string().trim().min(2,"You must enter your name!").normalize().optional(),
    email: z.email("Email is invalid").optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/,{error: `Password must have at least 8 characters one lowercase letter, one uppercase letter, one number, one special character, and no spaces.`}).optional(),

})

const UserRoleValidator = z.object({
    role: z.enum(Role)
})
const PostValidator = z.object({
    title: z.string().min(3,{error: (iss) => `${iss.input} must have at least 3 characters!`}),
    content: z.string().normalize(),
    mediaString: z.string().regex(/^\w+(?:,\w+)*$/,{error: (iss) => `${iss.input} must have at comma separated words.`}).optional(),
    topicString: z.string().regex(/^\w+(?:,\w+)*$/, {error: (iss) => `${iss.input} must have comma separated words!`}).optional()
})

const CommentValidator = z.object({
    content: z.string().trim().min(3,"Your comment must not be empty! It must be at least 3 characters!").normalize(),
    postId: z.string().transform((idString) => parseInt(idString))

})

export {CommentValidator, PostValidator, UserValidator,UserUpdateValidator,UserRoleValidator}