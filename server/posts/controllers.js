import User from '../user/model/User.js';
import cloudinary from '../utils/cloudinary.js';
import Post from './model/Post.js';

export const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const postCount = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const allUsers = await User.find();

    const finalResult = posts.map(post => {
      const { _id, name, image, description, date, likes, userid, likedBy } = post;
      const isLiked = likedBy.some(id => id.toString() === req.session.userid);

      const user = allUsers.filter(u => u._id.toString() === post.userid.toString());
      const last = {
        _id,
        name,
        image,
        description,
        date,
        likes,
        userid,
        liked: isLiked,
        likedBy,
        username: user[0].username,
        userimage: user[0].userimage,
      }
      return last;
    })
    res.status(200).send({
      posts: finalResult,
      currenPage: page,
      totalPages: Math.ceil(postCount / limit),
      totalPostsCount: postCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get all posts!' });
  }
}

export const getTopPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ likes: -1 }).limit(3);

    res.status(200).send(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

export const createNewPost = (req, res) => {

  try {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        })
      }
    }).then(result => {
      Post.create({
        name: req.body.name,
        image: result.url,
        public_id: result.public_id,
        description: req.body.description,
        date: Date.now(),
        likes: 0,
        userid: req.session.userid
      })

      res.status(200).send({ message: 'Successfully created new post!' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}

export const getToEditPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id });

    if (post.userid.toString() !== req.session.userid.toString()) {
      return res.status(403).send({ message: 'You don\'t have permission to edit this post' });
    }

    res.status(200).send(post);

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id });
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (post.userid.toString() !== req.session.userid.toString()) {
      return res.status(403).send({ message: 'You don\'t have permission to edit this post' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    if (post.public_id) {
      await cloudinary.uploader.destroy(post.public_id);
    }
    const updated = await Post.findByIdAndUpdate(
      post._id,
      {
        name: req.body.name,
        image: result.url,
        public_id: result.public_id,
        description: req.body.description
      },
      { new: true }
    );

    res.status(200).send({ message: 'Successfully edited the post!' });

  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export const deletePost = async (req, res) => {
  const { _id } = req.body;
  try {
    const post = await Post.findById(_id);
    const postUser = post.userid.toString();

    if (req.session.userid !== postUser) {
      return res.status(403).send({ message: 'You don\'t have permission to delete this post' });
    }

    const deleted = await Post.findByIdAndDelete(_id);

    cloudinary.uploader
      .destroy(deleted.public_id)
      .then(result => console.log(result));
    res.status(200).send({ message: 'Successfully deleted!' });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

export const addLike = async (req, res) => {
  const postId = req.body._id;
  const userId = req.session.userid;

  if (!userId) {
    return res.status(401).send({ message: 'Unauthorized!' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes -= 1;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    };

    await post.save();
    res.status(200).send({
      likes: post.likes,
      liked: !alreadyLiked
    });

  } catch (err) {
    console.error('Error in addLike:', err);
    res.status(500).send({ message: 'Error toggling like' });
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    // Check if the requesting user is the profile owner
    const isItOwner = req.session.userid === id;

    const totalPosts = await Post.find({ userid: id });
    const paginatedPosts = await Post.find({ userid: id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const finalPosts = paginatedPosts.map(post => {
      const { _id, name, image, description, date, likes, likedBy, userid } = post;
      const liked = post.likedBy.includes(req.session.userid);

      return {
        _id,
        name,
        image,
        description,
        date,
        likes,
        userid,
        likedBy,
        liked
      };
    });

    res.status(200).send({
      usersPosts: finalPosts,
      currentPage: page,
      totalPosts: totalPosts.length,
      totalPages: Math.ceil(totalPosts.length / limit),
      owner: isItOwner
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

export const postComment = async (req, res) => {
  const { postId, comment } = req.body;
  const commentUserId = req.session.userid;
  const commentUser = req.session.username;

  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    return res.status(400).send({ message: 'Comment cannot be empty' });
  }
  if (comment.length > 500) {
    return res.status(400).send({ message: 'Comment is too long (max 500 characters)' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }
    post.comments.push({
      commentuserid: commentUserId,
      commentusersname: commentUser,
      comment: comment.trim(),
      commentDate: Date.now()
    });

    await post.save();

    res.status(200).send(post)

  } catch (err) {
    res.status(500).send({ message: 'Error in commenting on the post' });
  }
}

export const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id });

    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const commentsSorted = post.comments.sort((a, b) => a.commentDate > b.commentDate ? -1 : 1);

    res.status(200).send({
      comments: commentsSorted
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}
