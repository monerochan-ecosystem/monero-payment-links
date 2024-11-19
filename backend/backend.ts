import { url, head, commonHead, cssReset } from "@spirobel/mininext";
head((mini) => mini.html`<title>hello hello</title>${commonHead}${cssReset}`);
url.set([
  [
    "/",
    (mini) => {
      return mini.html`<h1>Hello world</h1>`;
    },
  ],
  [
    "/bye",
    (mini) =>
      mini.html`<h1>Goodbye world</h1>${mini.head(
        mini.html`<title>bye bye</title>${commonHead}`
      )}`,
  ],
]);
url.set("/apple", (mini) => mini.html`<h1>hello pineapple </h1>`);

export default url.install;
