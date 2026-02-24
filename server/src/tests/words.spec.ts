import request from "supertest"
import app from "./index"

describe("GET /on", () => {
    it("should greet the world when no name is provided", async () => {
        const res = await request(app)
            .get("/words/on")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body).toEqual({ result: 2 });
    });

    it("should greet the user when a name is provided", async () => {
        const res = await request(app)
            .post("/words")
            .send({
                text: "Hello, World! This is some test text to outline the capabilities of counting the frequency of each word in a given text document. I am going to repeat test a bunch of times to show how this utility will count each word in a doc. Test test test! Well, Hello World! It's nice to meet you again, test test. It's a pleasure to meet you. Let us continue discussing the test and find exactly the test can be improved.",
                search: "test"
            })
            .set('Accept', 'application/json')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);
        expect(res.body.result).toEqual(9);
    });
});