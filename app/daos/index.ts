import { ShopifyQueryExecutor } from "./shopify";
import FileContentReader from "./FileContentReader";
import GraphQLDataManagers from "./shopify/GraphQLDataManagers";
import type { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import DBDataManagers from "./pg/DBDataManagers";
import { ShopifyProductManager } from "./ShopifyProductManager";

export interface ShopifyDataManagers {
  productManager: ShopifyProductManager;
}
export interface PGDataManagers {}
export const dataManagers = {
  get shopify(): ShopifyDataManagers {
    return new GraphQLDataManagers();
  },
  get pg(): PGDataManagers {
    return new DBDataManagers();
  },
};
