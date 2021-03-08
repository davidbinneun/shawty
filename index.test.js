const supertest = require("supertest");
const app = require("./app");
const request = supertest(app);
const Item = require('./backend/item.js');
const fs = require("fs").promises;

beforeAll(async () => {
    await fs.writeFile("./backend/testdata.json", "[]");
  });

describe("Sending URL to the server", () => {
    it("The URL is legal", async () => {
        const response = await request.post('/api/shorturl/new').type('form').send({url:"https://www.youtube.com/"});
        expect(response.status).toBe(201);
    });
    it("The URL is illegal", async () => {
        const response = await request.post('/api/shorturl/new').type('form').send({url:"utubecom/?hl=iw&gl=IL"});
        expect(response.status).toBe(400);
    });
    it("Corrupted file in server", async () => {
        await fs.writeFile("./backend/testdata.json", "[");
        const response = await request.post('/api/shorturl/new').type('form').send({url:"https://www.youtube.com/"});
        expect(response.status).toBe(500);
    });
});

describe("Redirect to URL by ID", () => {
    it("Send Legal ID", async () => {
        let newItem = new Item('https://www.youtube.com/');
        await fs.writeFile("./backend/testdata.json", JSON.stringify([newItem]));
        const response = await request.get(`/api/statistic/${newItem.id}`);
        expect(response.status).toBe(200);
    });
    it("Send Illegal ID", async () => {
        const response = await request.get(`/api/statistic/abc`);
        expect(response.status).toBe(400);
    });
    it("Legal ID but ID not found", async () => {
        const response = await request.get(`/api/statistic/abcdefg`);
        expect(response.status).toBe(404);
    });
    it("Corrupted file in server", async () => {
        await fs.writeFile("./backend/testdata.json", "[");
        const response = await request.get(`/api/statistic/abcdefg`);
        expect(response.status).toBe(500);
    });
});

describe("Get statistics by ID", () => {
    it("Send Legal ID", async () => {
        let newItem = new Item('https://www.youtube.com/');
        await fs.writeFile("./backend/testdata.json", JSON.stringify([newItem]));
        const response = await request.get(`/${newItem.id}`);
        expect(response.status).toBe(302);
    });
    it("Send Illegal ID", async () => {
        const response = await request.get(`/abc`);
        expect(response.status).toBe(400);
    });
    it("Legal ID but ID not found", async () => {
        const response = await request.get(`/abcdefg`);
        expect(response.status).toBe(404);
    });
    it("Corrupted file in server", async () => {
        await fs.writeFile("./backend/testdata.json", "[");
        const response = await request.get(`/abcdefg`);
        expect(response.status).toBe(500);
    });
});
