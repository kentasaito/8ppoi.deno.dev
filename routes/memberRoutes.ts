import { Context, Hono } from "hono/hono";
import { KvAdmin } from "kenta/kvadmin";
import { Member } from "../interfaces/Member.ts";

const kvAdmin = await KvAdmin.getInstance();

const app = new Hono();

import { layout } from "../pages/layout.ts";

app.get("/:memberId", async (c: Context) => {
  const memberId = c.req.param("memberId");
  const member = await kvAdmin.get(["members", memberId]) as Member;
  if (!member) {
    return c.html(layout("メンバーが見つかりません", "raw"));
  }
  const props = {
    memberId: memberId,
    member: member,
  };
  return c.html(layout("メンバープロフィール", "ts", props));
});

app.delete("/:memberId", async (c: Context) => {
  const memberId = c.req.param("memberId");
  return await kvAdmin.delete(["members", memberId]);
});

app.post("/", async (c: Context) => {
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

export { app as memberRoutes };
