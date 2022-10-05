<div align="center">
    <br />
    <img src="https://raw.githubusercontent.com/facalz/assets/main/facalz-npm/mdl-watching-box/image.png" alt="image">
    <h3>📺 mdl-watching-box</h3>
    <p>Webscrap to show what you are watching in MyDramaList.</p>
</div>

---

## Installation

```sh-session
//npm
npm install mdl-watching-box

//yarn
yarn add mdl-watching-box
```

## Prep work

1. Create a new public GitHub Gist. (<https://gist.github.com/>)
2. Create a token with the `gist` scope and copy it. (<https://github.com/settings/tokens/new>)

## Example usage

```js
const main = require('mdl-watching-box');

const {
    GIST_ID: gistId,
    GH_TOKEN: githubToken,
    USER: user,
    TITLE: title
} = process.env;

main(gistId, githubToken, user, title);
```

## Environment secrets

- **GIST_ID:** The ID portion from your gist url: https://gist.github.com/facalz/ `c7ecf280a4fc2214a85cef64896e020f`
- **GH_TOKEN:** The GitHub token generated above.
- **USER:** Your user in [MyDramaList](https://mydramalist.com).
- **TITLE:** Title for gist (Optional).