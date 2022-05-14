const axios = require("axios").default;
const expect = require("chai").expect;

describe("GET /", () => {
  it("send GET request to http://localhost:8080", async () => {
    await axios.get("http://localhost:8080/").then((result) => {
      expect(result.status).to.equal(200);
    });
  });
});

describe("GET /auth/google", () => {
  it("send GET request to http://localhost:8080/auth/google", async () => {
    await axios.get("http://localhost:8080/auth/google").then((result) => {
      expect(result.status).to.equal(200);
    });
  });
});

describe("GET /dashboard", () => {
  it("send GET request to http://localhost:8080/dashboard", async () => {
    await axios.get("http://localhost:8080/dashboard").then((result) => {
      expect(result.status).to.equal(200);
    });
  });
});
