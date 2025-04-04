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

app.get("/member/:memberId", async (c) => {
  const memberId = c.req.param("memberId");
  const member = await kvAdmin.get(["members", memberId]);
  if (!member) {
    return c.html(layout("メンバーが見つかりません", "raw"));
  }
  const props = {
    memberId: memberId,
    createdAt: new Date(member.createdAt).toLocaleString(),
    updatedAt: new Date(member.updatedAt).toLocaleString(),
    hookId: member.hookId,
    memberName: member.memberName,
    login: member.login,
    profile: member.profile,
  };
  return c.html(layout("メンバープロフィール", "ts", props));
});

app.post("/api/publish-profile", async (c) => {
  const body = await c.req.json();
  const res = await fetch(`https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/member.json`);
  const json =  await res.json();
  const member = await kvAdmin.get(["members", body.repository.owner.id.toString()]) ?? {
    createdAt: body.build.created_at,
  };
  const key = ["members", body.repository.owner.id.toString()];
  const value = Object.assign(member, {
    updatedAt: body.build.updated_at,
    hookId: body.id,
    memberName: json.memberName,
    login: body.repository.owner.login,
    profile	: json.profile,
  });
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

app.get("/test", async (c) => {
  const body = {
    "hook": {
      "id": 539075276,
      "updated_at": "2025-04-04T03:58:51Z",
      "created_at": "2025-04-04T03:58:51Z",
    },
    "repository": {
      "owner": {
        "login": "kentasaito",
        "id": 1627937,
      },
    },
  };
  const res = await fetch(`https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/member.json`);
  const json =  await res.json();
  const member = await kvAdmin.get(["members", body.repository.owner.id.toString()]) ?? {
    createdAt: body.hook.created_at,
  };
  const key = ["members", body.repository.owner.id.toString()];
  const value = Object.assign(member, {
    updatedAt: body.hook.updated_at,
    hookId: body.hook.id,
    memberName: json.memberName,
    login: body.repository.owner.login,
    profile	: json.profile,
  });
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

app.get("/*", serveStatic({ root: "./static/" }));

Deno.serve(app.fetch);
