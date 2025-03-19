import { GraphQLConnection } from "app/models/GraphQLData";
import { Product } from "app/models/Product";

export interface ShopifyProductManager {
    getProducts(first: number, after: string | null): Promise<GraphQLConnection<Product> | undefined>;
    getProduct(id: string): Promise<Product | undefined>;
}