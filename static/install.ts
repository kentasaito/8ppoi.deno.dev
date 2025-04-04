import { streamExec } from "jsr:@kenta/stream-exec@0.0.3";

if (await streamExec(
  "gh",
  { args: ["auth", "status"] },
) !== 0) {
  Deno.exit(1);
}
console.log();

let member = {
  id: "",
  login: "",
  name: "",
};
await streamExec(
  "gh",
  { args: ["api", "user"] },
  "",
  (stdoutMessage) => member = JSON.parse(stdoutMessage),
);

const repositories = {
  "8ppoi-sdk": {
    name: "8ppoi SDK",
    directory: "./8ppoi-sdk/",
  },
  "8ppoi-console": {
    name: "8ppoi Console",
    directory: "./8ppoi-sdk/console/",
  },
};

for (const [repositoryId, repository] of Object.entries(repositories)) {
  const repositoryPath = `../repos/${repositoryId}`; // .gitをつける
  console.log(`Installing ${repository.name} (${repositoryPath})`);

  const code = await streamExec("git", { args: ["clone", repositoryPath, repository.directory] });
  console.log();

  if (code !== 0) {
    console.error(`Failed to install ${repository.name} (${repositoryPath}):`);
    Deno.exit(1);
  }
}

if (await streamExec("gh", { args: ["repo", "view", `8ppoi-${member.id}`] }) !== 0) {
  console.log(`Installing member profile (git@github.com:kentasaito/8ppoi-member.git)`);
  if (await streamExec("git", { args: ["clone", "git@github.com:kentasaito/8ppoi-member.git", `./8ppoi-sdk/cartridges/${member.id}`] }) !== 0) {
    Deno.exit(1);
  }
  console.log();

  console.log(`Publishing member profile (git@github.com:${member.login}/8ppoi-${member.id}.git)`);
  Deno.chdir(`./8ppoi-sdk/cartridges/${member.id}`);
  Deno.writeTextFileSync("./member.json", JSON.stringify({
    memberId: member.id.toString(),
    memberName: member.name,
    login: member.login,
    profile: "(Please write your profile here.)",
  }, null, 2));
  if (await streamExec("git", { args: ["add", "-A"] }) !== 0) {
    Deno.exit(1);
  }
  if (await streamExec("git", { args: ["commit", "-m", "Add member.json"] }) !== 0) {
    Deno.exit(1);
  }
  if (await streamExec("gh", { args: ["repo", "create", `8ppoi-${member.id}`, "--public"] }) !== 0) {
    Deno.exit(1);
  }
  if (await streamExec("git", { args: ["remote", "set-url", "origin", `https://github.com/${member.login}/8ppoi-${member.id}.git`] }) !== 0) {
    Deno.exit(1);
  }
  if (await streamExec("git", { args: ["push", "-u", "origin", "main"] }) !== 0) {
    Deno.exit(1);
  }
  if (await streamExec("gh", { args: ["api", "--method", "POST", `/repos/${member.login}/8ppoi-${member.id}/pages`, "--input", "-"] }, '{"source":{"branch":"main","path":"/"}}') !== 0) {
    Deno.exit(1);
  }
  console.log();
} else {
  console.log(`Installing member profile (git@github.com:${member.login}/8ppoi-${member.id}.git)`);
  if (await streamExec("git", { args: ["clone", `git@github.com:${member.login}/8ppoi-${member.id}.git`, `./8ppoi-sdk/cartridges/${member.id}`] }) !== 0) {
    Deno.exit(1);
  }
  console.log();
}

console.log(
  `  \x1b[32mAwesome!\x1b[0m The 8ppoi SDK is all set up! \x1b[1m🚀\x1b[0m
  Now, run \x1b[34m\`cd ./8ppoi-sdk/\`\x1b[0m to navigate into the SDK directory.
  Then, go ahead and run \x1b[34m\`deno task dev\`\x1b[0m, open your browser,
  and check out \x1b[33mhttp://localhost:8000\x1b[0m.
  When you're done, hit \x1b[31mCtrl+C\x1b[0m to stop it. \x1b[32mEnjoy!\x1b[0m
`,
);
/*
let repositories;
await streamExec("gh", {
  args: ["repo", "list", "--json", "name,isPrivate"],
}, (stdoutMessage) => repositories = JSON.parse(stdoutMessage).filter((repository) => repository.isPrivate === false && repository.name.startsWith("8ppoi-")).map((repository) => repository.name.replace(/^8ppoi-/, "")));

console.log(repositories);
*/
