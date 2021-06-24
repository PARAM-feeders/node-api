const mongoose = require('mongoose');
const Post = mongoose.model('Post');

// get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//   get one post
const getSinglePost = async (req, res) => {
    await Post.findById(req.params.id)
        .exec((err, postData) => {
            if (!postData) {
                return res
                    .status(404)
                    .json({
                        "message": "postData not found"
                    });
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            }
            res
                .status(200)
                .json(postData);
        });

}

// create posts
const createPost = function (req, res) {
    Post.create({
        name: req.body.name,
        description: req.body.name
    },
        (err, postData) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(postData);
            }
        });
};

// delete post
const deletePost = function (req, res) {
    const id = req.params.id;
    if (id) {
        Post
            .findByIdAndRemove(id)
            .exec((err, postData) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }
                res
                    .status(204)
                    .json(null);
            });
    } else {
        res
            .status(404)
            .json({ "message": "No id" });
    }
};

// update post
const updatePost = function (req, res) {
    if (!req.params.id) {
        res.status(404).json({ "message": "Not found, id is required" })
        return;
    }
    Post.findById(req.params.id)
        .exec((err, postData) => {
            if (!postData) {
                res.status(404).json({ "message": "id not found" });
                return;
            } else if (err) {
                res.status(400).json(err);
                return;
            }

            postData.name = req.body.name,
                postData.description = req.body.description,

                postData.save((err, postData) => {
                    if (err) {
                        res.status(404).json(err);
                    }
                    else {
                        res.status(200).json(postData);
                    }
                })
        })
};

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    deletePost,
    updatePost
}