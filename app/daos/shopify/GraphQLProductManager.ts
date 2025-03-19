import { ShopifyQueryExecutorInterface } from ".";
import logger from "app/utils/logger";
import { ShopifyProductManager } from "../ShopifyProductManager";
import { Product } from "app/models/Product";
import { ConnectionResponse, GraphQLConnection, SingleObjectResponse } from "app/models/GraphQLData";

export class GraphQLProductManager implements ShopifyProductManager {
    constructor(private readonly queryExecutor: ShopifyQueryExecutorInterface) {}
    public async getProducts(first: number, after: string | null): Promise<GraphQLConnection<Product> | undefined> {
        try {
            const result = await this.queryExecutor.queryByName<ConnectionResponse<'products', Product>>("getProducts.graphql", { first: first, after: after});
            return result.data?.products;
        } catch(err) {
            if (err instanceof Error) {
                logger.error({ err }, `could not get products: ${err.message}`);
              } else {
                logger.error(`could not get products: ${err}`);
              }   
        }
    }
    public async getProduct(id: string): Promise<Product | undefined> {
        try {
            const result = await this.queryExecutor.queryByName<SingleObjectResponse<'product', Product>>("getProduct.graphql", { id: "" });
            return result.data?.product;
        } catch(err) {
            if (err instanceof Error) {
                logger.error({ err }, `could not get product: ${err.message}`);
              } else {
                logger.error(`could not get product: ${err}`);
              }          
        }      
    }
}