import { Descriptor, Index, Manifest as ManifestRaw, MediaType } from "./types";
import fetch from "node-fetch";
import { createHash } from "node:crypto";
import { RegistryError } from "./constants";
import { Manifest } from "./manifest";

const NAME_REGEX =
  /[a-z0-9]+((\.|_|__|-+)[a-z0-9]+)*(\/[a-z0-9]+((\.|_|__|-+)[a-z0-9]+)*)*/;
const TAG_REGEX = /[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}/;

type GetSessionResponse = {
  location: string;
  minChunkSize: number;
};

export class Registry {
  private registry: string;
  private headers: Headers;
  private pushBlobSize: number;

  constructor(
    registry: string,
    defaultHeaders: Headers = new Headers({
      "User-Agent": "oci-ts",
    })
  ) {
    this.registry = registry;
    this.headers = defaultHeaders;
    this.pushBlobSize = 1024;
  }

  public with_basic_auth(username: string, password: string): Registry {
    const token = Buffer.from(`${username}:${password}`).toString("base64");

    this.headers.append("Authorization", `Bearer ${token}`);

    return this;
  }

  public async getManifest(
    name: string,
    tag: string
  ): Promise<ManifestRaw | Index> {
    if (!new RegExp(NAME_REGEX).test(name)) {
      throw new Error(`${name} does not match NAME_REGEX`);
    }

    if (!new RegExp(TAG_REGEX).test(tag)) {
      throw new Error(`${name} does not match TAG_REGEX`);
    }

    const requestHeaders = new Headers([...this.headers.entries()]);
    requestHeaders.append("Accept", MediaType.IMAGE_INDEX);
    requestHeaders.append("Accept", MediaType.IMAGE_MANIFEST);

    const response = await fetch(
      `${this.registry}/v2/${name}/manifests/${tag}`,
      {
        method: "GET",
        headers: requestHeaders,
      }
    );

    console.log(await response.status);

    const result: any = await response.json();

    if ("mediaType" in result && typeof result.mediaType === "string") {
      if (result.mediaType === MediaType.IMAGE_MANIFEST) {
        return result as ManifestRaw;
      } else if (result.mediaType === MediaType.IMAGE_INDEX) {
        return result as Index;
      } else {
        throw new Error(`Unexpected media type: ${result.mediaType}`);
      }
    } else {
      throw new Error(`Response missing media type: ${JSON.stringify(result)}`);
    }
  }

  public async getBlob(
    name: string,
    digest: string
  ): Promise<NodeJS.ReadableStream> {
    if (!NAME_REGEX.test(name)) {
      throw new Error(`${name} does not match NAME_REGEX`);
    }

    const response = await fetch(
      `${this.registry}/v2/${name}/blobs/${digest}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Unexpected response from registry when getting blob: ${response.status}`
      );
    }

    if (response.body === null) {
      throw new Error("Empty body when fetching blob");
    }

    return response.body;
  }

  private async putBlobSessionId(
    name: string,
    digest: string
  ): Promise<GetSessionResponse> {
    const requestHeaders = new Headers([...this.headers.entries()]);
    requestHeaders.append("Content-Length", "0");
    console.log(requestHeaders);

    const response = await fetch(`${this.registry}/v2/${name}/blobs/uploads/`, {
      method: "POST",
      headers: requestHeaders,
    });

    const location = response.headers.get("Location");
    const minChunkSize = response.headers.get("OCI-Chunk-Min-Length") ?? "0";

    if (!location) {
      console.log(response);
      throw new Error(
        "Unexpected response from Registry, missing Location header."
      );
    }
    // ?digest=${digest}
    /**
     * Optionally, the location MAY be absolute (containing the protocol and/or hostname),
     * or it MAY be relative (containing just the URL path). For more information, see RFC 7231.
     */
    return {
      location: new URL(location, this.registry).href,
      minChunkSize: parseInt(minChunkSize),
    };
  }

  private async putBlobChunk(
    location: string,
    start: number,
    end: number,
    chunk: Buffer
  ): Promise<string> {
    const requestHeaders = new Headers([...this.headers.entries()]);
    requestHeaders.append("Content-Type", "application/octet-stream");
    requestHeaders.append("Content-Length", `${chunk.length}`);
    requestHeaders.append("Content-Range", `${start}-${end}`);

    const response = await fetch(location, {
      method: "PATCH",
      headers: requestHeaders,
      body: chunk,
    });

    const newLocation = response.headers.get("Location");

    if (!newLocation) {
      throw new Error(
        "Unexpected response from Registry, missing Location header."
      );
    }

    return new URL(newLocation, this.registry).href;
  }

  public async putBlob(name: string, data: Buffer) {
    if (!new RegExp(NAME_REGEX).test(name)) {
      throw new Error(`${name} does not match NAME_REGEX`);
    }

    const digest = createHash("sha256").update(data).digest("hex");

    let { location, minChunkSize } = await this.putBlobSessionId(name, digest);

    let chunkSize = Math.max(minChunkSize, this.pushBlobSize);

    let offset = 0;
    let chunk = data.subarray(offset * chunkSize, (offset + 1) * chunkSize);

    while (chunk.length > 0) {
      const start = offset * chunkSize;
      const end = start + chunkSize;
      location = await this.putBlobChunk(location, start, end, chunk);
      offset += 1;
      chunk = data.subarray(offset * minChunkSize, (offset + 1) * minChunkSize);
    }

    await fetch(`${location}?digest=${digest}`, {
      headers: this.headers,
      method: "PUT",
    });
  }

  public async putManifest(
    name: string,
    tag: string,
    manifest: ManifestRaw | Index
  ) {
    if (!new RegExp(NAME_REGEX).test(name)) {
      throw new Error(`${name} does not match NAME_REGEX`);
    }

    if (!new RegExp(TAG_REGEX).test(tag)) {
      throw new Error(`${name} does not match TAG_REGEX`);
    }

    const requestHeaders = new Headers([...this.headers.entries()]);
    requestHeaders.append("Content-Type", manifest.mediaType);

    const response = await fetch(
      `${this.registry}/v2/${name}/manifests/${tag}`,
      {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify(manifest),
      }
    );

    if (response.status !== RegistryError.SUCCESS) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    return response.headers.get("Location");
  }

  public async push(name: string, tag: string, manifest: Manifest) {
    manifest.layers.forEach(async (layer) => {
      await this.putBlob(name, layer.blob);
    });

    this.putManifest(name, tag, manifest.asManifest());
  }

  public async pull(name: string, tag: string): Promise<Manifest> {
    const manifest = await this.getManifest(name, tag);

    if (manifest.mediaType == MediaType.IMAGE_INDEX) {
      throw new Error("Index manifests are not supported");
    }

    const layers = await Promise.all(
      (manifest.layers ?? []).map(
        async (layer) => await this.getBlob(name, layer.digest)
      )
    );

    return new Manifest({
      artifactType: manifest.artifactType,
      config: manifest.config,
      layers: [],
      subject: manifest.subject,
      annotations: manifest.annotations,
    });
  }
}
