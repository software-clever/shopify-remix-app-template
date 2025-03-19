import type { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import GraphQLDataManagers from "./shopify/GraphQLDataManagers";
import type ShopifyDataManagersDataManagers from "./ShopifyDataManagers";

export function createShopifyDataManagers(
  graphqlClient: AdminGraphqlClient,
): ShopifyDataManagersDataManagers {
  return new GraphQLDataManagers(graphqlClient);
}