const express = require("express");
const app = express();
var mongoose = require("mongoose");
require('dotenv').config()

const product = require("./api/product");
const posts = require("./api/posts");



const connectDB = mongoose.connect(process.env.mongodburl).then(() => console.log('Now connected to MongoDB!')).catch(err => console.error('Something went wrong', err));

app.use(express.json({ extended: false }));
app.use("/api/product", product);
app.use("/api/posts", posts);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
