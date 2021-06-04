# dyson-graphql

> Simplify GraphQL stubbing with Dyson 🧙‍♂️

```javascript
const dysonGraphQl = require("dyson-graphql");

const schema = `
  type User {
    id: Int!
    name: String!
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    createUser(name: String!): User!
    updateUser(id: Int!, name: String!): User!
  }
`;

module.exports = {
  path: "/graphql",
  method: "POST",
  render: dysonGraphQl(schema)
    .query("currentUser", { id: 987, name: "Jane Smart" })
    .mutation("createUser", ({ name }) => ({ id: 456, name }))
    .mutation("updateUser", ({ id, name }) => {
      if (id < 1000) {
        return { id, name };
      }

      throw new Error("Can't update user");
    })
    .build()
};
```

- [X] Stub a query with a static response
- [X] Stub a mutation with a static response
- [X] Stub a query/mutation with a dynamic response
- [X] Stub a query/mutation with an error response
- [X] Stub multiple queries/mutations with responses
- [X] Stub multiple of the same query/mutation with different arugments with different responses
