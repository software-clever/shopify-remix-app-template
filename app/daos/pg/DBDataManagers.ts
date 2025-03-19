import { QueryExecutor } from ".";
import FileContentReader from "../FileContentReader";
import { PGDataManagers } from "../PGDataManagers";
import { getPool } from "./createPool";

export default class DBDataManagers implements PGDataManagers {
    constructor() {
        const pool = getPool();
        const fileContentReader = new FileContentReader();
        const queryExecutor = new QueryExecutor(pool, fileContentReader);
    }
}