const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("common"));

const apps = require("./playstore");

app.get("/apps", (req, res) => {
  const { genres = "", sort } = req.query;

  if (sort) {
    if (!["rating", "app"].includes(sort)) {
      return res.status(400).send("Sort must be either rating or app");
    }
  }

  if (genres) {
    if (
      !["action", "puzzle", "strategy", "casual", "arcade", "card"].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          "Genres must be action, puzzle, strategy, casual, arcade, or card"
        );
    }
  }

  let results = apps;

  // let results = apps.filter(app => {
  //   app.Genres.toLowerCase().includes(genres.toLowerCase());
  // });

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
