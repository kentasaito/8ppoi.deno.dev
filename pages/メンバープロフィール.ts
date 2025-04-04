import { Member } from "../interfaces/Member.ts";

export default (props: {memberId: string, member:Member}) => `
  <img width="192" height="192" style="border: 1px solid hsl(0, 0%, 0%); border-radius: 50%;" src="https://avatars.githubusercontent.com/${props.member.login}?s=192">
  <h1>${props.member.memberName}</h1>
  <div>
    <p>${props.member.profile}</p>
    <ul>
      <li><a href="https://${props.member.login}.github.io/8ppoi-${props.memberId}/">GitHub Pages</a></li>
      <li><a href="https://8ppoi.deno.dev/member/${props.memberId}">8ppoi member profile</a></li>
    </ul>
    登録日時: ${props.member.createdAt}<br>
    更新日時: ${props.member.updatedAt}<br>
    ビルドID: ${props.member.buildId}<br>
  </div>
`;
