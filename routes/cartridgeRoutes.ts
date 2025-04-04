import { Context, Hono } from "hono/hono";
import { KvAdmin } from "kenta/kvadmin";
import { Cartridge } from "../interfaces/Cartridge.ts";

const kvAdmin = await KvAdmin.getInstance();

const app = new Hono();

import { layout } from "../pages/layout.ts";

app.get("/:cartridgeId", async (c: Context) => {
  const cartridgeId = c.req.param("cartridgeId");
  const cartridge = await kvAdmin.get(["cartridges", cartridgeId]) as Cartridge;
  if (!cartridge) {
    return c.html(layout("カートリッジが見つかりません", "raw"));
  }
  const props = {
    cartridgeId: cartridgeId,
    cartridge: cartridge,
  };
  return c.html(layout("カートリッジ", "ts", props));
});

app.delete("/:cartridgeId", async (c: Context) => {
  const cartridgeId = c.req.param("cartridgeId");
  return await kvAdmin.delete(["cartridges", cartridgeId]);
});

app.post("/", async (c: Context) => {
  const body = await c.req.json();
  const res = await fetch(
    `https://${body.repository.owner.login}.github.io/8ppoi-${body.repository.owner.id}/cartridge.json`,
  );
  const json = await res.json();
  const cartridge =
    await kvAdmin.get(["cartridges", body.repository.owner.id.toString()]) ?? {
      createdAt: body.build.created_at,
    };
  const key = ["cartridges", body.repository.owner.id.toString()];
  const value = Object.assign(cartridge, {
    updatedAt: body.build.updated_at,
    buildId: body.id,
    cartridgeName: json.cartridgeName,
    login: body.repository.owner.login,
    profile: json.profile,
  });
  await kvAdmin.set(key, value);
  return c.json(await kvAdmin.list());
});

export { app as cartridgeRoutes };
