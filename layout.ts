import { Indentdown } from "kenta/indentdown";

const header = () => {
  return `
    <header>
      <a href="/">8ppoi</a>
      <nav>
        <ul>
          <li><a href="/sdk/">SDK</a></li>
        </ul>
      </nav>
    </header>
  `;
};

export const layout = (pageName: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>8ppoi</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        ${header()}
        ${Indentdown.getHtml(Deno.readTextFileSync(`./pages/${pageName}.id`))}
      </body>
    </html>
  `;
};
