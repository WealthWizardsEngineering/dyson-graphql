import express from "express";
import dyson from "dyson";
import supertest from "supertest";

describe("dyson-graphql", () => {
  const harness = express();

  const options = {};
  const configurations = [
    {
      path: "/users/:id",
      method: "GET",
      template: {
        id: (params) => params.id,
        name: "James Smith",
      },
    },
  ];

  dyson.registerServices(harness, options, configurations);

  const agent = supertest.agent(harness);

  it("should be configured correctly", async () => {
    const { status, body } = await agent.get("/users/123");

    expect(status).toBe(200);
    expect(body).toEqual({
      id: "123",
      name: "James Smith",
    });
  });
});
