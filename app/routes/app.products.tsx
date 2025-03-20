import { Card, Layout, List, Page, Text, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { dataManagers, initShopifyDataManagers } from "app/daos";
import { useLoaderData } from "@remix-run/react";
import { Product } from "app/models/Product";
import { useEffect, useState } from "react";
import { GraphQLConnection } from "app/models/GraphQLData";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  initShopifyDataManagers(admin.graphql);
  const products: GraphQLConnection<Product> | undefined =
    await dataManagers.shopify.productManager.getProducts(2, null);
  return { products };
};
export default function AdditionalPage() {
  const loaderData = useLoaderData<typeof loader>();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (loaderData?.products?.nodes) {
      setProducts(loaderData?.products?.nodes);
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
  Products: Product[];
}
const ProductList: React.FC<props> = ({ Products }) => {
  return (
    <List>
      {Products.map((p: Product) => (
        <List.Item key={p.id}>{p.handle}</List.Item>
      ))}
    </List>
  );
};
