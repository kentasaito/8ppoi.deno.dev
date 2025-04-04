import { Hono } from "hono/hono";
import { serveStatic } from "hono/hono/deno";
import { KvAdmin } from "kenta/kvadmin";
import { Member } from "./interfaces/Member.ts";

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
  const member = await kvAdmin.get(["members", memberId]) as Member;
  if (!member) {
    return c.html(layout("メンバーが見つかりません", "raw"));
  }
  const props = {
    memberId: memberId,
    createdAt: new Date(member.createdAt).toLocaleString(),
    updatedAt: new Date(member.updatedAt).toLocaleString(),
    buildId: member.buildId,
    memberName: member.memberName,
    login: member.login,
    profile: member.profile,
  };
  return c.html(layout("メンバープロフィール", "ts", props));
});

app.delete("/member/:memberId", async (c) => {
  const memberId = c.req.param("memberId");
  return await kvAdmin.delete(["members", memberId]);
});

app.post("/member", async (c) => {
  const body = await c.req.json();
  const res = await fetch(`https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/member.json`);
  const json =  await res.json();
  const member = await kvAdmin.get(["members", body.repository.owner.id.toString()]) ?? {
    createdAt: body.build.created_at,
  };
  const key = ["members", body.repository.owner.id.toString()];
  const value = Object.assign(member, {
    updatedAt: body.build.updated_at,
    buildId: body.id,
    memberName: json.memberName,
    login: body.repository.owner.login,
    profile	: json.profile,
  });
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

app.get("/*", serveStatic({ root: "./static/" }));

Deno.serve(app.fetch);
