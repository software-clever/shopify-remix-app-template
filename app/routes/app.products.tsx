import { Card, Layout, List, Page, Text, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { dataManagers, initShopifyDataManagers } from "app/daos";
import { useLoaderData } from "@remix-run/react";
import { SerializeFrom } from "app/models/SerializeFrom";
import { Product } from "app/models/Product";
import { useEffect, useState } from "react";
import { GraphQLConnection } from "app/models/GraphQLData";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  initShopifyDataManagers(admin.graphql);
  const products: GraphQLConnection<Product> | undefined =
    await dataManagers.shopify.productManager.getProducts(2, null);
  return { products: products?.nodes || [] };
};
type LoaderData = SerializeFrom<typeof loader>;
export default function ProductPage() {
  const loaderData = useLoaderData<LoaderData>();
  const [products, setProducts] = useState<LoaderData["products"]>([]);
  useEffect(() => {
    if (loaderData?.products) {
      setProducts(loaderData.products);
    }
  }, [loaderData]);
  return (
    <Page>
      <TitleBar title="Products" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                This app template demonstrates a basic app
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Products
              </Text>
              <ProductList Products={products}></ProductList>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
interface props {
  Products: LoaderData["products"];
}
const ProductList: React.FC<props> = ({ Products }) => {
  return (
    <List>
      {Products.map((p) => (
        <List.Item key={p.id}>{p.handle}</List.Item>
      ))}
    </List>
  );
};
