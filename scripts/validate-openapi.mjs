import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const contractPath = new URL("../contracts/openapi.json", import.meta.url);
const lockPath = new URL("../contracts/openapi.lock.json", import.meta.url);
const contractText = await readFile(contractPath, "utf8");
const contract = JSON.parse(contractText);
const lock = JSON.parse(await readFile(lockPath, "utf8"));
const sha256 = createHash("sha256").update(contractText).digest("hex");

if (contract.openapi !== lock.openapi || contract.info?.version !== lock.apiVersion) {
  throw new Error("OpenAPI version does not match contracts/openapi.lock.json");
}

if (sha256 !== lock.sha256) {
  throw new Error(`OpenAPI SHA-256 mismatch: expected ${lock.sha256}, got ${sha256}`);
}

console.log(`OpenAPI ${contract.openapi} contract ${contract.info.version} is valid (${sha256}).`);
