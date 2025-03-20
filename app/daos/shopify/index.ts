import type { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import {
  GraphQLConnection,
  GraphQLObject,
  GraphQLQueryResult,
} from "app/models/GraphQLData";
import FileContentReader from "../FileContentReader";

export interface ShopifyQueryExecutorInterface {
  queryByName<T>(
    name: string,
    variables?: Record<string, any>,
  ): Promise<GraphQLQueryResult<T>>;
}
export class ShopifyQueryExecutor {
  constructor(
    private readonly graphqlClient: AdminGraphqlClient,
    private readonly fileContentReader: FileContentReader,
  ) {}

  public async queryByName<T>(
    name: string,
    variables?: Record<string, any>,
  ): Promise<GraphQLQueryResult<T>> {
    const query = await this.fileContentReader.read(name);

    if (!query || query.trim().length === 0) {
      return {
        data: undefined,
        errors: [{ message: `Query named '${name}' not found or empty.` }],
      };
    }
    try {
      const response = await this.graphqlClient(query, { variables });
      const json = await response.json();
      return json;
    } catch (errors) {
      return { errors };
    }
  }
}
