import { AdminGraphqlClient } from "@shopify/shopify-app-remix/server";
import ShopifyDataManagers from "../ShopifyDataManagers";

export default class GraphQLDataManager implements ShopifyDataManagers {
    constructor(private readonly graphql: AdminGraphqlClient) {
    }
}