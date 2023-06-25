//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//Connect to DB

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

//Create Schema

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//Routing all articles

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find();
      res.send(foundArticles);
    } catch (err) {
      res.send(err);
    }
  })
  .post(async function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    try {
      await newArticle.save();
      res.send("Successfully added a new article");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function (req, res) {
    try {
      await Article.deleteMany();
      res.send("Deleted all articles!");
    } catch (err) {
      res.send(err);
    }
  });

// app.get("/articles", function (req, res) {
//   Article.find(function (err, foundArticles) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(foundArticles);
//     }
//   });
// });

// app.get("/articles", async function (req, res) {
//   try {
//     const foundArticles = await Article.find();
//     res.send(foundArticles);
//   } catch (err) {
//     res.send(err);
//   }
// });

// app.post("/articles", function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle.save(function (err) {
//     if (!err) {
//       res.sen("Sucessfully added a new article");
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.post("/articles", async function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   try {
//     await newArticle.save();
//     res.send("Successfully added a new article");
//   } catch (err) {
//     res.send(err);
//   }
// });

// app.delete("/articles", async function (req, res) {
//   try {
//     await Article.deleteMany();
//     res.send("Deleted all articles!");
//   } catch (err) {
//     res.send(err);
//   }
// });

//Routing individual articles

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .put(async function (req, res) {
    try {
      const updatedArticle = await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      );

      if (updatedArticle) {
        res.send("Successfully updated the article.");
      } else {
        res.send("No articles matching that title was found.");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .patch(async function (req, res) {
    try {
      const updateLinedArticle = await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body }
      );

      if (updateLinedArticle) {
        res.send("Successfully updated the article.");
      } else {
        res.send("No articles matching that title was found.");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function (req, res) {
    try {
      const deleteArticle = await Article.deleteOne({
        title: req.params.articleTitle,
      });

      if (deleteArticle) {
        res.send("Article sucessfully deleted!");
      } else {
        res.send("An error occured!");
      }
    } catch (err) {
      res.send(err);
    }
  });

//Listen on port

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
