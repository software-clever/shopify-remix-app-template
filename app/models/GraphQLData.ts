export interface GraphQLConnection<T> {
  edges?: Edges<T>;
  nodes?: T[];
  pageInfo?: PageInfo;
}
export interface Edges<T> {
  cursor: string;
  node: T[];
}
export interface PageInfo {
  endCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
}
export interface GraphQLObject {
  id: string;
}
export interface GraphQLQueryResult<T> {
  data?: T;
  errors?: any;
}
export type SingleObjectResponse<
  TName extends string,
  TObject extends GraphQLObject,
> = {
  [key in TName]: TObject;
};
export type ConnectionResponse<
  TName extends string,
  TObject extends GraphQLObject,
> = {
  [key in TName]: GraphQLConnection<TObject>;
};
