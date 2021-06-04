import express from "express";
import dyson from "dyson";
import supertest from "supertest";
import dysonGraphQl from ".";

interface User {
  id: string;
  name: string;
}

describe("dyson-graphql", () => {
  const harness = express();

  const schema = `
    type User {
      id: String!
      name: String!
    }
  
    type Query {
      user: User!
    }

    type Mutation {
      createUser(name: String!): User!
    }
  `;

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
    {
      path: "/graphql",
      method: "POST",
      render: dysonGraphQl(schema)
        .query<User>("user", { id: "987", name: "Jane Smart" })
        .mutation<User>("createUser", { id: "987", name: "Jane Smart" })
        .build(),
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

  it("should respond to a valid GraphQL query", async () => {
    const query = `
      query GetUser {
        user {
          id
          name
        }
      }
    `;

    const { status, body } = await agent.post("/graphql").send({ query });

    expect(status).toBe(200);
    expect(body).toEqual({
      data: {
        user: {
          id: "987",
          name: "Jane Smart",
        },
      },
    });
  });

  it("should respond to a valid GraphQL mutation", async () => {
    const mutation = `
      mutation CreateUser {
        createUser(name: "Fred Black") {
          id
          name
        }
      }
    `;

    const { status, body } = await agent
      .post("/graphql")
      .send({ query: mutation });

    expect(status).toBe(200);
    expect(body).toEqual({
      data: {
        createUser: {
          id: "987",
          name: "Jane Smart",
        },
      },
    });
  });

  it("should reject non-compliant request", async () => {
    const mutation = `
      mutation CreateUser {
        createUser(name: "Fred Black") {
          id
          name
        }
      }
    `;

    const { status, body } = await agent.post("/graphql").send({ mutation });

    expect(status).toBe(200);
    expect(body).toEqual({
      errors: ["Body must be a string. Received: undefined."],
    });
  });

  it("should reject sub field selections that do not match the schema", async () => {
    const mutation = `
      mutation CreateUser {
        createUser(name: "Fred Black") {
          id
          name
          nonExistentField
        }
      }
    `;

    const { status, body } = await agent
      .post("/graphql")
      .send({ query: mutation });

    expect(status).toBe(200);
    expect(body).toEqual({
      errors: ['Cannot query field "nonExistentField" on type "User".'],
    });
  });

  it("should reject mutations not included in schema", async () => {
    const mutation = `
      mutation ChangeUser {
        updateMutation(name: "Jamie Smith") {
          id
        }
      }
    `;

    const { status, body } = await agent
      .post("/graphql")
      .send({ query: mutation });

    expect(status).toBe(200);
    expect(body).toEqual({
      errors: ['Cannot query field "updateMutation" on type "Mutation".'],
    });
  });
});
