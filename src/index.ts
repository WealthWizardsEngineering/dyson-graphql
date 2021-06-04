import { Handler } from "express";
import buildHandler from "./build-handler";

export interface StubSpec<T> {
  name: string;
  response: T;
}

export interface Variables {
  [key: string]: number | string | boolean | null | Variables;
}
export interface ResponseResolver<T> {
  (variables: Variables): T;
}

export interface ChainableStubBuilder {
  query<T>(
    name: String,
    response: T | ResponseResolver<T>
  ): ChainableStubBuilder;
  mutation<T>(
    name: String,
    response: T | ResponseResolver<T>
  ): ChainableStubBuilder;
  build(): Handler;
}

export default function dysonGraphQl(schema: string): ChainableStubBuilder {
  const queries = [] as StubSpec<any>[];
  const mutations = [] as StubSpec<any>[];

  return {
    query<T>(name: String, response: T | ResponseResolver<T>) {
      queries.push({ name: name as string, response });

      return this;
    },
    mutation<T>(name: String, response: T | ResponseResolver<T>) {
      mutations.push({ name: name as string, response });

      return this;
    },
    build: () => buildHandler(schema, queries, mutations),
  };
}
