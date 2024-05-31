import { Descriptor } from "./descriptor";

export type Manifest = {
  /**
   * This REQUIRED property specifies the image manifest schema version.
   * For this version of the specification, this MUST be 2 to ensure backward compatibility with older versions of Docker.
   * The value of this field will not change. This field MAY be removed in a future version of the specification.
   */
  schemaVersion: 2;
  /**
   * This property SHOULD be used and [remain compatible]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md#compatibility-matrix} with earlier versions of this specification and with other similar external formats.
   * When used, this field MUST contain the media type `application/vnd.oci.image.manifest.v1+json`.
   * This field usage differs from the descriptor use of `mediaType`.
   */
  mediaType: "application/vnd.oci.image.manifest.v1+json";

  /**
   * This OPTIONAL property contains the type of an artifact when the manifest is used for an artifact.
   * This MUST be set when config.mediaType is set to the empty value.
   * If defined, the value MUST comply with RFC 6838, including the naming requirements in its section 4.2,
   * and MAY be registered with IANA.
   *
   * Implementations storing or copying image manifests MUST NOT error on encountering an artifactType that is unknown to the implementation.
   */
  artifactType?: string;

  config?: Descriptor;
  layers: Descriptor[];
  /**
   * This OPTIONAL property specifies a descriptor of another manifest.
   * This value defines a weak association to a separate [Merkle Directed Acyclic Graph (DAG)]{@link https://en.wikipedia.org/wiki/Merkle_tree} structure, and is used by the [`referrers` API]{@link https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers} to include this manifest in the list of responses for the subject digest.
   */
  subject?: Descriptor;
  /**
   * This OPTIONAL property contains arbitrary metadata for this descriptor.
   * This OPTIONAL property MUST use the [annotation rules]{@link https://github.com/opencontainers/image-spec/blob/main/annotations.md#rules}.
   */
  annotations?: {
    [key: string]: string;
  };
};

export type Index = {
  /**
   * This REQUIRED property specifies the image manifest schema version.
   * For this version of the specification, this MUST be 2 to ensure backward compatibility with older versions of Docker.
   * The value of this field will not change. This field MAY be removed in a future version of the specification.
   */
  schemaVersion: 2;
  /**
   * This property SHOULD be used and [remain compatible]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md#compatibility-matrix} with earlier versions of this specification and with other similar external formats.
   * When used, this field MUST contain the media type `application/vnd.oci.image.index.v1+json`.
   * This field usage differs from the [descriptor]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#properties} use of `mediaType`.
   */
  mediaType: "application/vnd.oci.image.index.v1+json";
  /**
   * This OPTIONAL property contains the type of an artifact when the manifest is used for an artifact.
   * If defined, the value MUST comply with [RFC 6838]{@link https://tools.ietf.org/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}, and MAY be registered with [IANA]{@link https://www.iana.org/assignments/media-types/media-types.xhtml}.
   */
  artifactType?: string;

  /**
   * This REQUIRED property contains a list of [manifests]{@link https://github.com/opencontainers/image-spec/blob/main/manifest.md} for specific platforms.
   * While this property MUST be present, the size of the array MAY be zero.
   */
  manifests: Descriptor[];

  /**
   * This OPTIONAL property specifies a descriptor of another manifest.
   * This value defines a weak association to a separate [Merkle Directed Acyclic Graph (DAG)]{@link https://en.wikipedia.org/wiki/Merkle_tree} structure, and is used by the [`referrers` API]{@link https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers} to include this manifest in the list of responses for the subject digest.
   */
  subject?: Descriptor;
  /**
   * This OPTIONAL property contains arbitrary metadata for the image index.
   * This OPTIONAL property MUST use the [annotation rules]{@link https://github.com/opencontainers/image-spec/blob/main/annotations.md#rules}.
   *
   * See [Pre-Defined Annotation Keys](annotations.md#pre-defined-annotation-keys).
   */
  annotations?: {
    [key: string]: string;
  };
};
