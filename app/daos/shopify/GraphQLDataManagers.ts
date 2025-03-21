import { ShopifyQueryExecutor, ShopifyQueryExecutorInterface } from ".";
import { ShopifyDataManagers } from "..";
import FileContentReader from "../FileContentReader";
import { ShopifyProductManager } from "../ShopifyProductManager";
import { GraphQLProductManager } from "./GraphQLProductManager";

export default class GraphQLDataManager implements ShopifyDataManagers {
  productManager: ShopifyProductManager;
  constructor() {
    const fileContentReader = new FileContentReader();
    const queryExecutor: ShopifyQueryExecutorInterface = new ShopifyQueryExecutor(fileContentReader);
    this.productManager = new GraphQLProductManager(queryExecutor);
  }
}
