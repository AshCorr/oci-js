import { Registry } from "../src/registry"
import * as tar from "tar";
import { writeFile, rm, mkdir } from "fs/promises";
import { createWriteStream } from "fs";

const registry = new Registry("https://ghcr.io");

let manifest = await registry.get_manifest("turbot/steampipe", "latest");


if (manifest.mediaType === 'application/vnd.oci.image.index.v1+json') {
    console.log(`Getting ${manifest.manifests[0].digest}`)
    manifest = await registry.get_manifest("turbot/steampipe", manifest.manifests[0].digest);
}

if (manifest.mediaType !== 'application/vnd.oci.image.manifest.v1+json') {
    throw new Error(`Unexpected manifest media type: ${manifest.mediaType}`);
}

await rm("test", {
    force: true,
    recursive: true,
})
await mkdir("test")

await writeFile("./test/manifest.json", JSON.stringify(manifest))

const blob = await registry.get_blob("turbot/steampipe", manifest.config?.digest ?? "latest");
const writeStream = createWriteStream(`./test/${manifest.config?.digest ?? "latest"}.tar.gz`);
await blob.pipe(writeStream);

for await (var layer of manifest.layers ?? []) {
    const blob = await registry.get_blob("turbot/steampipe", layer.digest);
    const writeStream = createWriteStream(`./test/${layer.digest}.tar.gz`)
    await blob.pipe(writeStream);
}