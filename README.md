# dyson-graphql

[![WealthWizardsEngineering](https://circleci.com/gh/WealthWizardsEngineering/dyson-graphql.svg?style=svg)](https://app.circleci.com/pipelines/github/WealthWizardsEngineering/dyson-graphql)
[![npm version](https://badge.fury.io/js/dyson-graphql.svg)](https://badge.fury.io/js/dyson-graphql)

> Simplify GraphQL stubbing with Dyson 🔧

[Dyson](https://github.com/webpro/dyson) is great at making development simpler when different endpoints provide different responses. 
However as GraphQL uses the same endpoint for all requests, stubbing requires adding logic and 
complexity. Especially if you want fast feedback when executing invalid or incomplete GraphQL 
queries.

`dyson-graphql` wraps your stubbed data in the [`graphql`](https://www.npmjs.com/package/graphql) 
reference implementation for reliable and accurate results.

## Getting Started

```bash
$ yarn add --dev dyson-graphql
```

Add a new file to your dyson stubs directory for your GraphQL endpoint, use a schema and stubbed 
responses to provide a built resolver to the dyson `render` key;

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

## Configuration

Specify your Dyson `path` and `method` properties as normal, for most GraphQL endpoints this will 
end with `/graphql` and be a `POST` method.

Supply your schema to the default export as above, this is necessary so `graphql` can validate 
queries.

Chain `query` and `mutation` for each stubbed GraphQL method.

- `query` and `mutation` methods can have a static response by supplying the response
- dynamic response by supplying a function (can be used with libraries like `faker`)
- errors by supplying a function that throws an error

Build the resolver by finishing the chain by calling `build`.

Provide this the built resolver to the Dyson stub as the `render` property.
