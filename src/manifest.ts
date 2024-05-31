import { createHash } from "node:crypto";
import { Descriptor, MediaType, Manifest as RawManifest } from "./types";

export class Layer {
  mediaType: string;
  blob: Buffer;

  constructor(mediaType: string, blob: Buffer) {
    this.mediaType = mediaType;
    this.blob = blob;
  }

  static fromBlob(mediaType: string, blob: Buffer): Layer {
    return new Layer(mediaType, blob);
  }
  static fromFile(mediaType: string, path: string): Layer {
    return new Layer(mediaType, Buffer.from(path));
  }

  asDescriptor(): Descriptor {
    return {
      mediaType: this.mediaType,
      digest: createHash("sha256").update(this.blob).digest("hex"),
      size: this.blob.length,
    };
  }
}

const emptyDescriptor: Descriptor = {
  mediaType: MediaType.IMAGE_LAYER_EMPTY,
  digest:
    "sha256:44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
  size: 2,
  data: "e30=",
};

type ManifestOptions = {
  artifactType?: string;
  config?: Descriptor;
  layers?: Layer[];
  subject?: Descriptor;
  annotations?: {
    [key: string]: string;
  };
};

export class Manifest {
  artifactType?: string;
  config?: Descriptor;
  layers: Layer[];
  subject?: Descriptor;
  annotations?: {
    [key: string]: string;
  };

  constructor(options: ManifestOptions) {
    this.config = options.config ?? emptyDescriptor;
    this.layers = options.layers ?? [];
    this.artifactType = options.artifactType;
    this.subject = options.subject;
    this.annotations = options.annotations;
  }

  asManifest(): RawManifest {
    const layers = this.layers.map((layer) => layer.asDescriptor());

    return {
      schemaVersion: 2,
      mediaType: "application/vnd.oci.image.manifest.v1+json",
      artifactType: this.artifactType,
      config: this.config,
      layers: layers.length ? layers : [emptyDescriptor],
      annotations: this.annotations,
    };
  }
}
