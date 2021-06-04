import buildHandler from "./build-handler";

describe("build-handler", () => {
  it("should reject empty schemas", () => {
    const target = () => buildHandler("", [], []);

    expect(target).toThrow(new Error("GraphQL schema cannot be empty"));
  });

  it("should only allow one query of each name", () => {
    const schema = `
      type User {
        id: String!
        name: String!
      }

      type Query {
        user: User!
      }
    `;

    const queries = [
      {
        name: "user",
        response: {
          id: "123",
          name: "James Smith",
        },
      },
      {
        name: "user",
        response: {
          id: "987",
          name: "Jane Smart",
        },
      },
    ];

    const target = () => buildHandler(schema, queries, []);

    expect(target).toThrow(
      new Error("GraphQL response already stubbed for 'user'")
    );
  });

  it("should only allow one mutation of each name", () => {
    const schema = `
      type User {
        id: String!
        name: String!
      }

      type Mutation {
        createUser(name: String!): User!
      }
    `;

    const mutations = [
      {
        name: "createUser",
        response: {
          id: "123",
          name: "James Smith",
        },
      },
      {
        name: "createUser",
        response: {
          id: "987",
          name: "Jane Smart",
        },
      },
    ];

    const target = () => buildHandler(schema, [], mutations);

    expect(target).toThrow(
      new Error("GraphQL response already stubbed for 'createUser'")
    );
  });
});
