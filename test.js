const pathSplitter = (hash) => {
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

const mainRouter = () => pathSplitter(window.location.hash);

const goTo = (splitted) => (window.location.hash = splitted.join("/"));

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
        let tp = null;
        if (t.indexOf("?") > 0) {
            //split
            let tx = t.split("?")
            t = tx.shift();
            tp = tx.join("?")
            tx = tp.split("&").map(q => q.split("="));
            if (!out.query) out.query = {}
            for (let ti of tx) {
                if (ti.length == 2) {
                    out.query[ti[0]] = ti[1]
                } else {
                    out.query[ti[0]] = true
                }
            }

        }
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


const rawTest = (t, p, q, r) => {

    if (q == r) return true;
    if (JSON.stringify(q) == JSON.stringify(r)) return true
    return false
}

const test = (t, p, r) => {
    let q = patternMatcher(pathSplitter(t), pathSplitter(p))
    if (rawTest(t, p, q, r)) console.log("OK", t, p)
    else console.error("ERR", t, p, r, q)
}



test("/a/b/c/d", "*", {})
test("/a/b/c/d", "/a/*", {})
test("/a/b/c/d", "/a/+/c/+", {})
test("/a/b/c/d", "/a/b/c/d", {})
test("/a/b/c/d", "/a/b/c", null)
test("/a/b/c/d", "/b/*", null)
test("/a/b/c/d", "/a/b/c/:par", {
    par: "d"
})

test("/a?sort=1&nort=2&pert/b/c/d", "/a/b/c/:par", {
    query: {
        sort: '1',
        nort: '2',
        pert: true
    },
    par: 'd'
})