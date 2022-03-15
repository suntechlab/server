const express = require("express");
const router = express.Router();
var Blogs = require('../models/blogs');
/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Get data has successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get('/allblogs', async (req, res) => {
  var result = await Blogs.find({});
  if (!result) {
      return res.status(400).send('Blog not found');
  }
  res.json(result);
});

router.get('/:id', async (req, res) => {
  var id = req.params.id
  var result = await Blogs.findOne({slug: id});
  if (!result) {
      res.json({notFound:true});
  }
  res.json(result);
});

module.exports = router;
