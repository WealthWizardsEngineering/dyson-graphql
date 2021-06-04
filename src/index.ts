import { Handler } from "express";
import buildHandler from "./build-handler";

export interface ChainableStubBuilder {
  query<T>(name: String, response: T): ChainableStubBuilder;
  mutation<T>(name: String, response: T): ChainableStubBuilder;
  build(): Handler;
}

export default function dysonGraphQl(schema: string): ChainableStubBuilder {
  const queries = [];
  const mutations = [];

  return {
    query<T>(name: String, response: T) {
      queries.push({ name, response });

      return this;
    },
    mutation<T>(name: String, response: T) {
      mutations.push({ name, response });

      return this;
    },
    build: () => buildHandler(schema, queries, mutations),
  };
}
