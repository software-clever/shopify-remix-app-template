import { ShopifyQueryExecutor } from "./shopify";
import FileContentReader from "./FileContentReader";
import GraphQLDataManagers from "./shopify/GraphQLDataManagers";
import type { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import DBDataManagers from "./pg/DBDataManagers";
import { ShopifyProductManager } from "./ShopifyProductManager";

export interface ShopifyDataManagers {
  productManager: ShopifyProductManager;
}
let shopifyDataManagers: ShopifyDataManagers;
export const initShopifyDataManagers = (graphqlClient: AdminGraphqlClient) => {
  const queryExecutor = new ShopifyQueryExecutor(
    graphqlClient,
    new FileContentReader(),
  );
  shopifyDataManagers = new GraphQLDataManagers(queryExecutor);
};
export interface PGDataManagers {}
export const dataManagers = {
  get shopify(): ShopifyDataManagers {
    if (!shopifyDataManagers)
      throw new Error("ShopifyDataManagers not initialized!");
    return shopifyDataManagers;
  },
  get pg(): PGDataManagers {
    return new DBDataManagers();
  },
};
