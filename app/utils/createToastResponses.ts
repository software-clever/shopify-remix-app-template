import { GraphQLQueryResult } from "app/models/GraphQLData";
import { ToastResponse } from "app/models/ToastResponse";

export function createToastResponses<T>(result: GraphQLQueryResult<T>): ToastResponse[] {
    const toasts: ToastResponse[] = [];
    if (result.errors) {
      toasts.push({
        isError: true,
        message: result.errors.message || "An error occurred",
      });
      if (Array.isArray(result.errors.GraphQLErrors)) {
        toasts.push(
          ...result.errors.GraphQLErrors.map((graphQLError) => ({
            isError: true,
            message: graphQLError.message || "GraphQL error",
          }))
        );
      }
    }
    return toasts;
  }