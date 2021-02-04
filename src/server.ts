import * as express from "express";
import { connect } from "./database/database";
import app from "./app";

connect();

app.listen(app.get("port"), () => {
    console.log(`Server started on http://localhost:${app.get("port")}`);
});
