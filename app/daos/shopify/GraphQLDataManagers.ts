import { ShopifyQueryExecutorInterface } from ".";
import { ShopifyDataManagers } from "..";
import { ShopifyProductManager } from "../ShopifyProductManager";
import { GraphQLProductManager } from "./GraphQLProductManager";

export default class GraphQLDataManager implements ShopifyDataManagers {
  productManager: ShopifyProductManager;
  constructor(private readonly queryExecutor: ShopifyQueryExecutorInterface) {
    this.productManager = new GraphQLProductManager(this.queryExecutor);
  }
}
