const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("common"));

const apps = require("./playstore");

app.get("/apps", (req, res) => {
  const { genre = "", sort } = req.query;

  if (sort) {
    if (!["rating", "app"].includes(sort)) {
      return res.status(400).send("sort must be either rating or app");
    }
  }

  if (genre) {
    if (
      !["action", "puzzle", "strategy", "casual", "arcade", "card"].includes(
        genre
      )
    ) {
      return res
        .status(400)
        .send(
          "genre must be one of the following: action, puzzle, strategy, casual, arcade, or card"
        );
    }
  }

  let results = apps.filter(app =>
    app.Genres.toLowerCase().includes(genre.toLowerCase())
  );

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
