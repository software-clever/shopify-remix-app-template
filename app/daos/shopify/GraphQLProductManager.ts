import { ShopifyQueryExecutorInterface } from ".";
import logger from "app/utils/logger";
import { ShopifyProductManager } from "../ShopifyProductManager";
import { Product } from "app/models/Product";
import {
  ConnectionResponse,
  GraphQLConnection,
  SingleObjectResponse,
} from "app/models/GraphQLData";
import { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import { ToastResponse } from "app/models/ToastResponse";
import { createToastResponses } from "app/utils/createToastResponses";

export class GraphQLProductManager implements ShopifyProductManager {
  constructor(private readonly queryExecutor: ShopifyQueryExecutorInterface) {}
  public async getProducts(
    graphqlClient: AdminGraphqlClient,
    first: number,
    after: string | null,
  ): Promise<GraphQLConnection<Product> | ToastResponse[]> {
    try {
      const result = await this.queryExecutor.queryByName<
        ConnectionResponse<"products", Product>
      >(graphqlClient, "getProducts.graphql", { first: first, after: after });
      if(result.data?.products) return result.data.products;
      const toasts: ToastResponse[] = createToastResponses(result);
      return toasts;
    } catch (err) {
      const toast: ToastResponse = {
        isError: true,
        message: "Could not get products: "
      };
      if (err instanceof Error) {
        toast.message = toast.message + err.message;
        logger.error({ err }, toast.message);
      } else {
        toast.message = toast.message + err;
        logger.error(toast.message);
      } 
      return [toast];
    }
  }
  public async getProduct(graphqlClient: AdminGraphqlClient, id: string): Promise<Product | ToastResponse[]> {
    try {
      const result = await this.queryExecutor.queryByName<
        SingleObjectResponse<"product", Product>
      >(graphqlClient, "getProduct.graphql", { id: "" });
      if(result.data?.product) return result.data.product;
      const toasts: ToastResponse[] = createToastResponses(result);
      return toasts;
    } catch (err) {
      const toast: ToastResponse = {
        isError: true,
        message: "Could not get product: "
      };
      if (err instanceof Error) {
        toast.message = toast.message + err.message;
        logger.error({ err }, toast.message);
      } else {
        toast.message = toast.message + err;
        logger.error(toast.message);
      } 
      return [toast];
    }
  }
}
