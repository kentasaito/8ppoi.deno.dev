import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

import { layout } from "./layout.ts";

app.get("/", (c) => c.html(layout("トップページ")));
app.get("/sdk/", (c) => c.html(layout("8ppoi SDK/8ppoi SDK")));
app.get("/sdk/prerequisites", (c) => c.html(layout("8ppoi SDK/事前準備")));
app.get("/sdk/install", (c) => c.html(layout("8ppoi SDK/インストール")));
app.get("/sdk/tasks", (c) => c.html(layout("8ppoi SDK/タスク")));
app.get("/sdk/uninstall", (c) => c.html(layout("8ppoi SDK/アンインストール")));
app.get("/*", serveStatic({ root: "./static/" }));

Deno.serve(app.fetch);
