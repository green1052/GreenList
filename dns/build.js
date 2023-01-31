const fs = require("fs");
const {EOL} = require("os");

const cloudflareIp = "104.16.181.45";

const headers = fs.readFileSync("./headers.txt", "utf8");
const rules = fs.readFileSync("./rules.txt", "utf8");
const hosts = fs.readFileSync("./hosts.txt", "utf8");

const buildRules = [];

for (const rule of rules.split(EOL)) {
    if (rule === "" || rule.startsWith("!")) continue;
    buildRules.push(rule);
}

for (const host of hosts.split(EOL)) {
    if (host === "" || host.startsWith("!")) continue;

    if (host.startsWith("/") && host.endsWith("/")) {
        buildRules.push(`${host}$dnsrewrite=${cloudflareIp}`);
        continue;
    }

    buildRules.push(`||${host}$dnsrewrite=${cloudflareIp}`);
}

fs.writeFileSync("../dns.txt", `${headers}${EOL}${buildRules.join(EOL)}`);