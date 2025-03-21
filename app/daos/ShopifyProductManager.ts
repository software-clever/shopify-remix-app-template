import { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import { GraphQLConnection } from "app/models/GraphQLData";
import { Product } from "app/models/Product";
import { ToastResponse } from "app/models/ToastResponse";

export interface ShopifyProductManager {
  getProducts(
    graphqlClient: AdminGraphqlClient,
    first: number,
    after: string | null,
  ): Promise<GraphQLConnection<Product> | ToastResponse[]>;
  getProduct(graphqlClient: AdminGraphqlClient, id: string): Promise<Product | ToastResponse[]>;
}
