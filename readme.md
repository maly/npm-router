# Usage

```
const paths = [
  ["/tipy/edit/:id", require("./js/tipedit.js"), { showSection: "newtip" }],
  ["/tipy/:filtr", require("./js/tips.js"), { showSection: "tips" }],
  ["/tipy", require("./js/tips.js"), { showSection: "tips" }],
  ["/tip/novy", require("./js/newtip.js"), { showSection: "newtip" }],
  ["/tip/:id", nihil],
  ["/vydani/:datum", require("./js/vydani.js"), { showSection: "vydani" }],
  [
    "/vydani",
    require("./js/vydani.js"),
    { datum: vydani, showSection: "vydani" }
  ],
  ["/preview/:datum", require("./js/preview.js"), {}],
  ["/preview", require("./js/preview.js"), { datum: vydani }],
  ["/about", nihil],
  ["*", nihil, { showSection: "index" }]
];

const ohc = require("./js/router.js")(paths);

//middleware push

ohc((params,pattern) => {
  if (params.showSection) {
    $("section").hide();
    $("section#" + params.showSection).show();
    delete params.showSection;
  }


});

window.onhashchange = ohc;

```

### Queries

#/a/b/c?par1=foo&par2=bar&par3

=> params.query = {par1:"foo",par2:"bar",par3:true}

### Globals

`ohc("global")` register global functions:

- `window.history.stepUp()` to go one level up (=drop last fraction of hash)
- `window.history.stepBack()` to go back to the previous page
