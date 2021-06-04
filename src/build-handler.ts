import { buildSchema, graphql } from "graphql";
import { Handler } from "express";
import { StubSpec } from "./index";

interface Resolvers {
  [key: string]: Function;
}

export default function buildHandler(
  rawSchema: string,
  queries: StubSpec<object>[],
  mutations: StubSpec<object>[]
): Handler {
  if (!rawSchema) {
    throw new Error("GraphQL schema cannot be empty");
  }

  const schema = buildSchema(rawSchema);

  const root = [...queries, ...mutations].reduce((fields: Resolvers, query) => {
    if (fields[query.name]) {
      throw new Error(`GraphQL response already stubbed for '${query.name}'`);
    }

    return {
      ...fields,
      [query.name]: (variables: object) => {
        if (typeof query.response === "function") {
          return query.response(variables);
        }

        return query.response;
      },
    };
  }, {});

  return async (req, res): Promise<void> => {
    graphql(schema, req.body.query, root, {}, req.body.variables)
      .then(({ data, errors }) => {
        const parsedErrors = errors?.map((error) => error.message);

        res.status(200);
        res.json({ data, errors: parsedErrors || undefined });
      })
      .catch((err) => {
        console.error("dyson-graphql: Unable to stub request", err);

        res.status(500);
        res.json({ error: "Unable to stub request" });
      });
  };
}
