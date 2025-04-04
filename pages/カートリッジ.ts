import { Cartridge } from "../interfaces/Cartridge.ts";

export default (props: { cartridgeId: string; cartridge: Cartridge }) => `
  <img width="192" height="192" style="border: 1px solid hsl(0, 0%, 0%); border-radius: 50%;" src="https://avatars.githubusercontent.com/${props.member.login}?s=192">
  <h1>${props.cartridge.cartridgeName}</h1>
  <div>
    <p>${props.cartridge.instruction}</p>
    <ul>
      <li><a href="https://${props.member.login}.github.io/8ppoi-${props.memberId}/">GitHub Pages</a></li>
      <li><a href="https://8ppoi.deno.dev/member/${props.memberId}">8ppoi member profile</a></li>
    </ul>
    登録日時: ${props.cartridge.createdAt}<br>
    更新日時: ${props.cartridge.updatedAt}<br>
    ビルドID: ${props.cartridge.buildId}<br>
  </div>
`;
