import { faker } from '@faker-js/faker';
import request from "supertest"
import app from "../app"
import datasource from "../datasource";
const user = process.env.User_Test_Email ?
    { email: process.env.User_Test_Email, password: process.env.User_Test_Password } :
    { email: "mac@mac.com", password: "azertyuiop" };
let data = {} as any;
beforeAll(async () => {
    await datasource.initialize()
})

describe("Get Addresses", () => {
    it("should get an token", async () => {
        const form = {
            email: user.email,
            password: user.password,
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

describe("Put Modify Address", () => {
    it("should modify a existing address infos with the infos sended", async () => {
        const base = { 'Authorization': `Bearer ${data["token"]}`, 'Content-Type': 'application/json' }
        const form = {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription()
        }
        const res = await request(app)
            .put("/api/addresses/3")
            .send(form)
            .set(base)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.item.description).toEqual(form.description);
    });
});