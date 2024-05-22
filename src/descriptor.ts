export type ImageIndex = {
    /**
     * This REQUIRED property specifies the image manifest schema version. 
     * For this version of the specification, this MUST be 2 to ensure backward compatibility with older versions of Docker.
     * The value of this field will not change. This field MAY be removed in a future version of the specification.
     */
    schemaVersion: 2
    /**
     * This property SHOULD be used and [remain compatible]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md#compatibility-matrix} with earlier versions of this specification and with other similar external formats.
     * When used, this field MUST contain the media type `application/vnd.oci.image.index.v1+json`.
     * This field usage differs from the [descriptor]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#properties} use of `mediaType`.
     */
    mediaType: 'application/vnd.oci.image.index.v1+json',
    /**
     * This OPTIONAL property contains the type of an artifact when the manifest is used for an artifact.
     * If defined, the value MUST comply with [RFC 6838]{@link https://tools.ietf.org/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}, and MAY be registered with [IANA]{@link https://www.iana.org/assignments/media-types/media-types.xhtml}.
     */
    artifactType?: string,

    /**
     * This REQUIRED property contains a list of [manifests]{@link https://github.com/opencontainers/image-spec/blob/main/manifest.md} for specific platforms.
     * While this property MUST be present, the size of the array MAY be zero.
     */
    manifests: ImageManifest[];

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
        [key: string]: string,
    }
};

export type ImageManifest = Descriptor & {
    /**
     * This REQUIRED property specifies the image manifest schema version.
     * For this version of the specification, this MUST be 2 to ensure backward compatibility with older versions of Docker.
     * The value of this field will not change. This field MAY be removed in a future version of the specification.
     */
    schemaVersion: 2,
    /**
     * This property SHOULD be used and [remain compatible]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md#compatibility-matrix} with earlier versions of this specification and with other similar external formats.
     * When used, this field MUST contain the media type `application/vnd.oci.image.manifest.v1+json`.
     * This field usage differs from the descriptor use of `mediaType`.
     */
    mediaType: "application/vnd.oci.image.manifest.v1+json",
    /**
     * This OPTIONAL property describes the minimum runtime requirements of the image.
     * This property SHOULD be present if its target is platform-specific.
     */
    platform?: Platform;
    config?: Descriptor;
    layers?: Descriptor[];
    /**
     * This OPTIONAL property specifies a descriptor of another manifest.
     * This value defines a weak association to a separate [Merkle Directed Acyclic Graph (DAG)]{@link https://en.wikipedia.org/wiki/Merkle_tree} structure, and is used by the [`referrers` API]{@link https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers} to include this manifest in the list of responses for the subject digest.
     */
    subject?: Descriptor;
};

export type Platform = {
    /**
     * This REQUIRED property specifies the CPU architecture.
     * Image indexes SHOULD use, and implementations SHOULD understand, values listed in the Go Language document for [GOARCH]{@link https://golang.org/doc/install/source#environment}.
     */
    architecture: string;
    /**
     * This REQUIRED property specifies the operating system.
     * Image indexes SHOULD use, and implementations SHOULD understand, values listed in the Go Language document for [GOOS]{@link https://golang.org/doc/install/source#environment}.
     */
    os: string;
    /**
     * This OPTIONAL property specifies the version of the operating system targeted by the referenced blob.
     * Implementations MAY refuse to use manifests where os.version is not known to work with the host OS version.
     * Valid values are implementation-defined. e.g. 10.0.14393.1066 on windows.
     */
    "os.version": string,
    /**
     * This OPTIONAL property specifies an array of strings, each specifying a mandatory OS feature. When os is windows, image indexes SHOULD use, and implementations SHOULD understand the following values:
     *  - win32k: image requires win32k.sys on the host (Note: win32k.sys is missing on Nano Server)
     * When os is not windows, values are implementation-defined and SHOULD be submitted to this specification for standardization.
     */
    "os.features": string[],
    /**
     * This OPTIONAL property specifies the variant of the CPU.
     * Image indexes SHOULD use, and implementations SHOULD understand, variant values listed in the [Platform Variants]{@link https://github.com/opencontainers/image-spec/blob/main/image-index.md#platform-variants} table.
     */
    variant: string,
}

export type Descriptor = {
    /**
     * This REQUIRED property contains the media type of the referenced content.
     * Values MUST comply with [RFC 6838]{@link https://datatracker.ietf.org/doc/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}.
     * The OCI image specification defines [several of its own MIME types]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md} for resources defined in the specification.
     */
    mediaType: string
    /**
     * This REQUIRED property is the digest of the targeted content, conforming to the requirements outlined in [Digests]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#digests}.
     * Retrieved content SHOULD be verified against this digest when consumed via untrusted sources.
     */
    digest: string,
    /**
     * This REQUIRED property specifies the size, in bytes, of the raw content.
     * This property exists so that a client will have an expected size for the content before processing.
     * If the length of the retrieved content does not match the specified length, the content SHOULD NOT be trusted.
     */
    size: number,
    /**
     * This OPTIONAL property specifies a list of URIs from which this object MAY be downloaded.
     * Each entry MUST conform to [RFC 3986]{@link https://tools.ietf.org/html/rfc3986}.
     * Entries SHOULD use the `http` and `https` schemes, as defined in [RFC 7230]{@link https://tools.ietf.org/html/rfc7230#section-2.7}.
     */
    urls?: string[],
    /**
     * This OPTIONAL property contains arbitrary metadata for this descriptor.
     * This OPTIONAL property MUST use the [annotation rules]{@link https://github.com/opencontainers/image-spec/blob/main/annotations.md#rules}.
     */
    annotations?: {
        [key: string]: string
    }
    /**
     * This OPTIONAL property contains an embedded representation of the referenced content.
     * Values MUST conform to the Base 64 encoding, as defined in [RFC 4648]{@link https://tools.ietf.org/html/rfc4648#section-4}.
     * The decoded data MUST be identical to the referenced content and SHOULD be verified against the [`digest`]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#digests} and `size` fields by content consumers.
     * See [Embedded Content]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#embedded-content} for when this is appropriate.
     */
    data?: string,
    /**
     * This OPTIONAL property contains the type of an artifact when the descriptor points to an artifact.
     * This is the value of the config descriptor `mediaType` when the descriptor references an [image manifest]{@link https://github.com/opencontainers/image-spec/blob/main/manifest.md}.
     * If defined, the value MUST comply with [RFC 6838]{@link https://tools.ietf.org/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}, and MAY be registered with [IANA]{@link https://www.iana.org/assignments/media-types/media-types.xhtml}.
     */
    artifactType?: string;
}