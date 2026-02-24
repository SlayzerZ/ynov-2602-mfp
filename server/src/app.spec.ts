import { faker } from '@faker-js/faker';
import request from "supertest"
import app from "./app"
import datasource from "./datasource";

let data = {} as any;
beforeAll(async () => {
    await datasource.initialize()
})
describe("Post Create User", () => {
    it("should create a new user with the infos sended", async () => {
        const form = {
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        data["email"] = form.email;
        data["password"] = form.password;
        const res = await request(app)
            .post("/api/users")
            .send(form)
            .set('Accept', 'application/json')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.item.email).toEqual(form.email);
    });
});

describe("Get Token and log", () => {
    it("should get an token", async () => {
        const form = {
            email: data["email"],
            password: data["password"]
        }
        const res = await request(app)
            .post("/api/users/tokens")
            .send(form)
            .set('Accept', 'application/json')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.token.length).toBeGreaterThan(10);
        data["token"] = res.body.token;
    });

    it("should get info using an token", async () => {
        const base = { 'Authorization': `Bearer ${data["token"]}`, 'Content-Type': 'application/json' }
        const res = await request(app)
            .get("/api/users/me")
            .set(base)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.item.email).toEqual(data["email"]);
    });
});

describe("Get Addresses", () => {
    it("should get all addresses stock", async () => {
        const base = { 'Authorization': `Bearer ${data["token"]}`, 'Content-Type': 'application/json' }
        const res = await request(app)
            .get("/api/addresses")
            .set(base)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.items[0].id).toEqual(1);
    });
});