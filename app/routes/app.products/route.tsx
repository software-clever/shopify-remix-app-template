import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { dataManagers } from "app/daos";
import { GraphQLConnection } from "app/models/GraphQLData";
import { Product } from "app/models/Product";
import { ToastResponse } from "app/models/ToastResponse";
import { authenticate } from "app/shopify.server";
import { action } from "../webhooks.app.scopes_update";
import { SerializeFrom } from "app/models/SerialiseFrom";
import Client from "./client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const productsResult: GraphQLConnection<Product> | ToastResponse[]  = await dataManagers.shopify.productManager.getProducts(admin.graphql, 2, null);
  const isToastResponseArray = Array.isArray(productsResult);
  const products: Product[] = !isToastResponseArray && productsResult?.nodes
    ? productsResult.nodes
    : []; 
  const toastMessages: ToastResponse[] = isToastResponseArray
    ? productsResult
    : [];
  return { products, toastMessages };
};
export type LoaderData = SerializeFrom<typeof loader>;
export type ActionData = SerializeFrom<typeof action>;
export default function UI() {
    const loaderData = useLoaderData<LoaderData>();
    const actionData = useActionData<ActionData>();
    return <Client loaderData={loaderData} actionData={actionData} />;
  }
export interface ClientProps {
    loaderData: LoaderData | undefined;
    actionData: ActionData | undefined;
}