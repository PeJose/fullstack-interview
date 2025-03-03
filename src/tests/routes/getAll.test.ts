import request from "supertest";
import server from "../../server";

describe("Refactor(GET:/memberships)", () => {
  it("should return mock data equal to legacy response", async () => {
    const legacyResponse = await request(server)
      .get("/legacy/memberships")
      .expect(200);
    const modernResponse = await request(server)
      .get("/memberships")
      .expect(200);
    expect(modernResponse.body).toEqual(legacyResponse.body);
  });
});
