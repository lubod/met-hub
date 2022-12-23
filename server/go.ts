const duckdb = require("duckdb");

export default class Go {
  db: any;

  constructor() {
    console.info("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
    this.db = new duckdb.Database(":memory:"); // or a file name for a persistent DB
  }

  select() {
    this.db.all("SELECT 42 AS fortytwo", (err: any, res: any) => {
      if (err) {
        throw err;
      }
      console.log(res[0].fortytwo);
    });
  }
}
