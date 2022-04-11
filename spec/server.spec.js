const request = require("request");

describe("calc", () => {
  it("should multiply 2 and 2", () => {
    expect(2 * 2).toBe(4);
  });
});

describe("get messages", () => {
  it("should return 200 Ok", (done) => {
    request.get("http://localhost:3000/messages", (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
  it("should return a list, thats not empty", (done) => {
    request.get("http://localhost:3000/messages", (error, response) => {
      expect(JSON.parse(response.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe("get messages from user", () => {
  it("should return 200 Ok", (done) => {
    request.get("http://localhost:3000/messages/Richard", (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
  it("name should be Richard", (done) => {
    request.get("http://localhost:3000/messages/Richard", (error, response) => {
      expect(JSON.parse(response.body)[0].name).toEqual("Richard");
      done();
    });
  });
});
