export default (props) => `
  <h1>${props.name}</h1>
  <p>メンバーID: ${props.memberId}</p>
  <p>メンバー名: ${props.memberName}</p>
  <p>GitHub ID: ${props.login}</p>
  <p>プロフィール: ${props.profile}</p>
  <p>作成日時: ${props.createdAt}</p>
  <p>更新日時: ${props.updatedAt}</p>
  <p>Webhook ID: ${props.hookId}</p>
`;
