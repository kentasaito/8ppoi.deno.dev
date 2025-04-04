export default (props) => `
  <img width="192" height="192" src="https://avatars.githubusercontent.com/${props.login}?s=192">
  <h1>${props.memberName}</h1>
  <div>
    <p>${props.profile}</p>
    <ul>
      <li><a href="https://${props.login}.github.io/8ppoi-${props.memberId}/">GitHub Pages</a></li>
      <li><a href="https://8ppoi.deno.dev/member/${props.memberId}">8ppoi member profile</a></li>
    </ul>
    登録日時: ${props.createdAt}<br>
    更新日時: ${props.updatedAt}<br>
    ビルドID: ${props.buildId}<br>
  </div>
`;
