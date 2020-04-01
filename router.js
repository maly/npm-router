const pathSplitter = hash => {
  if (!hash || !hash.length) return [];
  if (hash[0] == "#") hash = hash.substr(1);
  if (!hash || !hash.length) return [];
  var hh = hash.split("/");
  while (hh[0] === "") {
    hh.shift();
  }
  while (hh[hh.length - 1] === "") {
    hh.pop();
  }
  return hh;
};

const mainRouter = () => pathSplitter(document.location.hash);

var patterns;

const patternMatcher = (test, pattern) => {
  let testpos = 0;
  let out = {};
  for (let i = 0; i < pattern.length; i++) {
    let p = pattern[i];
    if (p === "*") {
      return out;
    }
    if (testpos >= test.length) {
      return null;
    }
    let t = test[testpos];
    if (p[0] === ":") {
      //param
      out[p.substr(1)] = t;
      testpos++;
      continue;
    }
    if (p === "+") {
      testpos++;
      continue;
    }
    if (p === t) {
      testpos++;
      continue;
    }
    return null;
  }
  return testpos === test.length ? out : null;
};

var middleware = [];

const onHashChange = main => {
  //middleware
  if (typeof main === "function") {
    //middleware add

    middleware.push(main);

    return;
  }

  var addr = mainRouter();
  var pq;
  var found;
  for (found = 0; found < patterns.length; found++) {
    pq = patternMatcher(addr, patterns[found][0]);
    if (!pq) continue;
    break;
  }
  //console.log("R", pq, i);
  if (found >= patterns.length) {
    //no match
    document.location.hash = "#/";
    return;
  }
  var params = { ...patterns[found][2], ...pq };
  //middleware

  for (let i = 0; i < middleware.length; i++) {
    middleware[i](params);
  }
  /*
  if (params.showSection) {
    $("section").hide();
    $("section#" + params.showSection).show();
  }*/
  patterns[found][1](params);
};

module.exports = pats => {
  //some init stuff

  //pattern parser
  patterns = pats.map(q => {
    return [pathSplitter(q[0]), q[1], q[2] ? q[2] : {}];
  });

  //console.log(patterns);

  return onHashChange;
};
