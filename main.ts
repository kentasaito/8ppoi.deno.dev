import { Hono } from "hono/hono";
import { serveStatic } from "hono/hono/deno";
import { KvAdmin } from "kenta/kvadmin";

const kvAdmin = await KvAdmin.getInstance();

const app = new Hono();

import { layout } from "./layout.ts";

app.get("/", (c) => c.html(layout("トップページ")));
app.get("/sdk/", (c) => c.html(layout("8ppoi SDK/8ppoi SDK")));
app.get("/sdk/prerequisites", (c) => c.html(layout("8ppoi SDK/事前準備")));
app.get("/sdk/install", (c) => c.html(layout("8ppoi SDK/インストール")));
app.get("/sdk/tasks", (c) => c.html(layout("8ppoi SDK/タスク")));
app.get("/sdk/uninstall", (c) => c.html(layout("8ppoi SDK/アンインストール")));
app.get("/sdk/uninstall", (c) => c.html(layout("8ppoi SDK/アンインストール")));

app.post("/api/publish-profile", async (c) => {
  const body = await c.req.json();
  const res = await fetch(`https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/member.json`);
  const member =  await res.json();
  const key = ["members", body.repository.owner.id.toString()];
  const value = {
    memberName: member.memberName,
    login: body.repository.owner.login,
    profile	: member.profile,
  };
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

app.get("/test", async (c) => {
  const body = {
    "repository": {
      "owner": {
        "login": "kentasaito",
        "id": 1627937,
      },
    },
  };
  const res = await fetch(`https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/member.json`);
  const member =  await res.json();
  const key = ["members", body.repository.owner.id.toString()];
  const value = {
    memberId: body.repository.owner.id.toString(),
    memberName: member.memberName,
    login: body.repository.owner.login,
    profile	: member.profile,
  };
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

app.get("/*", serveStatic({ root: "./static/" }));

Deno.serve(app.fetch);
