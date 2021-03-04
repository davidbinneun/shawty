const supertest = require("supertest");
const app = require("./app");
const request = supertest(app);
const fs = require("fs");

describe("POST route", () => {
    it("Should post new url item", async () => {
        const response = await request.post('/api/shorturl/new').send({url:"https://www.youtube.com/?hl=iw&gl=IL"});
        expect(response.status).toBe(200);
    });
});