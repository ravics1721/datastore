import express from "express";
import { Users } from "./schema.js";

const router = express.Router();

router
  .route("/user")
  .get((req, res) => {
    const pageQuery = req.query.page;
    const limit = 25;
    const pageNumber = Number(pageQuery) || 1;
    const skipPage = pageNumber === 1 ? 0 : limit * pageNumber;
    Users.find()
      .limit(25)
      .skip(skipPage)
      .sort({
        date: "desc",
      })
      .exec((err, data) => {
        if (err) {
          res.status(400).json({
            error: err.message,
          });
        } else {
          res.status(200).json({
            users: data,
          });
        }
      });
  })
  .post((req, res) => {
    let { name, user } = req.body;
    if (!name || !user) {
      res.status(400).json({
        error: "name & user are required",
      });
      return;
    }
    let newUser = {
      user,
      name,
      date: new Date(),
      changes: 0,
    };
    Users.create(newUser)
      .then((result) => {
        res.status(200).json({
          message: "Added new user successfully",
          user: result,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message,
        });
      });
  });

router.put("/user/:id", (req, res) => {
  let id = req.params.id;
  if (!id) {
    res.status(400).json({
      error: "id is required",
    });
  }
  let { name, user } = req.body;

  Users.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        user: user,
        date: new Date(),
      },
      $inc: {
        changes: 1,
      },
    },
    { upsert: true, new: true }
  )
    .then((result) => {
      res.status(200).json({
        message: "Updated user successfully",
        user: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message,
      });
    });
});

export default router;
