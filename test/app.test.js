const app = require("../app");
const chai = require("chai");
const { expect } = require("chai");
const supertest = require("supertest");

chai.use(require("chai-like"));
chai.use(require("chai-things"));

describe("GET /apps", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.keys("App", "Rating", "Genres");
      });
  });

  it("should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "eyeballs" })
      .expect(400, "sort must be either rating or app");
  });

  it("should sort by rating", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "rating" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.rating < appAtI.rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it("should sort by app", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "app" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.app < appAtI.app) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it("should filter for genre", () => {
    return supertest(app)
      .get("/apps")
      .query({ genre: "casual" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        // expect(res.body).to.have.deep.property("[1].Genres", "Casual");
        expect(res.body).to.contain.something.like({
          Genres: "Casual"
        });
      });
  });
});
