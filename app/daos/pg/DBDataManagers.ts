import { QueryExecutor } from ".";
import { PGDataManagers } from "..";
import FileContentReader from "../FileContentReader";
import { getPool } from "./createPool";

export default class DBDataManagers implements PGDataManagers {
  constructor() {
    const pool = getPool();
    const fileContentReader = new FileContentReader();
    const queryExecutor = new QueryExecutor(pool, fileContentReader);
  }
}
