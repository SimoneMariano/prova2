const amqp = require("amqplib/callback_api");
const dotenv = require("dotenv");

const Post = require("../models/Post");
const User = require("../models/User");

dotenv.config();

const QUEUE = process.env.QUEUE || "";

module.exports = {
  /**
   * @api {post} /api/v1/post Create new post
   * @apiName CreatePost
   *
   * @apiBody {Object} post Post
   * @apiBody {String} post[user] User's ID
   * @apiBody {String} post[content] Content of post
   * @apiBody {String[]} post[[photos]] Optional photos pf post
   *
   * @apiSuccess {Object} Created Post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * {
   *    "user": "0123456789",
   *    "content": "post's description"
   * }
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  createPost: async (req, res) => {
    const { content, photos } = req.body;
    const author = req.session.passport.user._id;
    const displayName = `${req.session.passport.user.firstName} ${req.session.passport.user.lastName}`;

    if (!author) {
      return res.send(400).json({ message: "Unauthorized" });
    }

    const createdPost = {
      author,
      displayName,
      content,
    };

    amqp.connect("amqp://rabbitmq", (error, connection) => {
      if (error) {
        console.error(error.message);
        res.sendStatus(500);
        return;
      }

      /* producer send post post to consumer */
      connection.createChannel((error, channel) => {
        if (error) {
          console.error(error.message);
          res.sendStatus(500);
          return;
        }

        channel.assertQueue(QUEUE);
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(createdPost)));
      });

      /* consumer save created post */
      connection.createChannel((error, channel) => {
        if (error) {
          console.error(error.message);
          res.sendStatus(500);
          return;
        }

        channel.assertQueue(QUEUE);
        channel.consume(QUEUE, async (message) => {
          const post = JSON.parse(message.content.toString());
          channel.ack(message);

          await User.findOne({ _id: author })
            .then(async (result) => {
              if (!result) {
                console.error(err.message);
                res.send(404).json({ error: "User Not Found" });
              }
            })
            .catch((err) => {
              console.error(err.message);
              res.sendStatus(500);
            });

          await Post(post)
            .save()
            .catch((err) => {
              console.error(err.message);
              res.sendStatus(500);
            });
        });
      });
      return res.status(200).json(createdPost);
    });
  },

  /**
   * @api {get} /api/v1/post Get all post
   * @apiName GetAllPost
   *
   * @apiSuccess {Object} Return all post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1"
   *    },
   *    {
   *        "user": "9876543210",
   *        "content": "post's description #2"
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  getAllPost: async (req, res) => {
    await Post.find({})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.error(err.message);
        res.sendStatus(500);
      });
  },

  /**
   * @api {get} /api/v1/post/:id Get all user's post
   * @apiName GetUserPost
   *
   * @apiParam {String} id User's ID
   *
   * @apiSuccess {Object} Return user's post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1"
   *    },
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #2 with photos",
   *        "photos": ["photo#1.jpg", "photo#2.pgn"]
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  getUserPost: async (req, res) => {},

  /**
   * @api {get} /api/v1/post/:user/:id Get user's post
   * @apiName GetUserPost
   *
   * @apiParam {String} user User's ID
   * @apiParam {String} id Post's ID
   *
   * @apiSuccess {Object} Return user's post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1"
   *    },
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #2 with photos",
   *        "photos": ["photo#1.jpg", "photo#2.pgn"]
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  getPostById: async (req, res) => {},

  /**
   * @api {patch} /api/v1/post/:id Update post
   * @apiName UpdatePostById
   *
   * @apiParam {String} id Post's ID
   *
   * @apiBody {Object} post Post
   * @apiBody {String} post[user] User's ID
   * @apiBody {String} post[content] Content of updated post
   *
   * @apiSuccess {Object} Return updated post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1 updated"
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  updatePostById: async (req, res) => {},

  /**
   * @api {delete} /api/v1/post/ Delete all post
   * @apiName DeleteAllPost
   *
   * @apiSuccess {Object} Return deleted post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1 deleted"
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  deleteAllPost: async (req, res) => {},

  /**
   * @api {delete} /api/v1/post/:user/:id Delete user's post
   * @apiName DeleteUserPost
   *
   * @apiParam {String} user User's ID
   * @apiParam {String} id Post's ID
   *
   * @apiSuccess {Object} Return deleted post
   * @apiSuccessExample {json} Success-Response:
   *
   * HTTP/1.1 200 OK
   * [
   *    {
   *        "user": "0123456789",
   *        "content": "post's description #1 deleted"
   *    }
   * ]
   *
   * @apiError UserNotFound The Id's user was not found
   * @apiErrorExample {json} Error-Response:
   *
   * HTTP/1.1 404 NOT FOUND
   * {
   *    "error": "UserNotFound"
   * }
   *
   */
  deletePostById: async (req, res) => {},
};
