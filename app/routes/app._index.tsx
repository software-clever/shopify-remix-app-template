import { useEffect } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';
import { Page } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const shopify = useAppBridge();
  useEffect(() => {
    const config = {
      ...shopify.config,
      host: shopify.config.host || ""
    };
    const app = createApp(config);
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.APP, '/app/products');
  },[shopify])

  return (
    <Page>
    </Page>
  );
}
