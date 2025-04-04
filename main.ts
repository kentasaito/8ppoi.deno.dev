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
    return c.html(layout("メンバーが見つかりません"));
  }
  const memberName = member.memberName;
  const profile = member.profile;
  const createdAt = new Date(member.createdAt).toLocaleString();
  const updatedAt = new Date(member.updatedAt).toLocaleString();
  const hookId = member.hookId;
  const login = member.login;
  return c.html(layout(`
    <h1>${memberName}のプロフィール</h1>
    <p>メンバーID: ${memberId}</p>
    <p>メンバー名: ${memberName}</p>
    <p>GitHub ID: ${login}</p>
    <p>プロフィール: ${profile}</p>
    <p>作成日時: ${createdAt}</p>
    <p>更新日時: ${updatedAt}</p>
    <p>Webhook ID: ${hookId}</p>
  `, "raw"));
});

app.post("/api/publish-profile", async (c) => {
  const body = await c.req.json();
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
