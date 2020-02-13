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

  function compareApp(a, b) {
    const appA = a.App.toLowerCase();
    const appB = b.App.toLowerCase();

    let comparison = 0;
    if (appA > appB) {
      comparison = 1;
    } else if (appA < appB) {
      comparison = -1;
    }
    return comparison;
  }

  function compareRating(a, b) {
    const appA = a.Rating;
    const appB = b.Rating;

    let comparison = 0;
    if (appA > appB) {
      comparison = 1;
    } else if (appA < appB) {
      comparison = -1;
    }
    return comparison;
  }

  if (sort) {
    if ("app".includes(sort)) {
      results.sort(compareApp);
    } else if ("rating".includes(sort)) {
      results.sort(compareRating);
    }
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
