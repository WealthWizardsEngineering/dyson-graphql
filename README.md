# dyson-graphql

> Simplify GraphQL stubbing with Dyson 🧙‍♂️

```javascript
const dysonGraphQl = require("dyson-graphql");

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

module.exports = {
  path: "/graphql",
  method: "POST",
  render: dysonGraphQl(schema)
    .query("user", { id: "987", name: "Jane Smart" })
    .mutation("createUser", { id: "456", name: "Bob Smith" })
    .build()
};
```

- [X] Stub a query with a static response
- [X] Stub a mutation with a static response
- [ ] Stub a query/mutation with a dynamic response
- [ ] Stub a query/mutation with an error response
- [X] Stub multiple queries/mutations with responses
- [ ] Stub multiple of the same query/mutation with different arugments with different responses
