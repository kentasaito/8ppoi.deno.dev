import { Context, Hono } from "hono/hono";
import { serveStatic } from "hono/hono/deno";
import { memberRoutes } from "./routes/memberRoutes.ts";

const app = new Hono();

import { layout } from "./pages/layout.ts";

app.get("/", (c: Context) => c.html(layout("トップページ")));
app.get("/sdk/", (c: Context) => c.html(layout("8ppoi SDK/8ppoi SDK")));
app.get("/sdk/prerequisites", (c: Context) => c.html(layout("8ppoi SDK/事前準備")));
app.get("/sdk/install", (c: Context) => c.html(layout("8ppoi SDK/インストール")));
app.get("/sdk/tasks", (c: Context) => c.html(layout("8ppoi SDK/タスク")));
app.get("/sdk/uninstall", (c: Context) => c.html(layout("8ppoi SDK/アンインストール")));
app.get("/sdk/uninstall", (c: Context) => c.html(layout("8ppoi SDK/アンインストール")));

app.route("/member", memberRoutes);

app.get("/*", serveStatic({ root: "./static/" }));

Deno.serve(app.fetch);
