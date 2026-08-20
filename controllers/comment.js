import { prisma } from "../lib/prisma.js";

async function createComment(req, res, next) {
  // Data after validation succeeded
  const { content, postId } = req.body;
  const authorId = req.user.id;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
    });

    return res.json({
      data: comment,
      message: "Comment created with success!",
    });
  } catch (err) {
    next(err);
  }
}

async function checkIfCommentExists(commentId, res) {
  try {
    const checkComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!checkComment) return res.json({ message: "Post not found!" });
    return checkPost;
  } catch (err) {
    throw err;
  }
}

async function updateComment(req, res, next) {
  const { commentId } = req.params;

  const checkComment = await checkIfCommentExists(commentId, res);

  const { content, postId } = req.body;
  const authorId = req.user.id;

  try {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
    });
    return res.json({ data: comment, message: "Comment edited with success!" });
  } catch (err) {
    next(err);
  }
}


async function deleteComment(req,res,next){
  const { commentId } = req.params;

  const checkComment = await checkIfCommentExists(commentId, res);

  try{
    const deletedComment = await prisma.comment.delete({
        where:{id:commentId}
    })
    return res.json({data: deletedComment, message: 'Comment deleted with success!'})
  }catch(err){
    next(err)
  }
}

export {createComment, updateComment,deleteComment};
