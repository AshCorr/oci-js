export type Descriptor = {
  /**
   * This REQUIRED property contains the media type of the referenced content.
   * Values MUST comply with [RFC 6838]{@link https://datatracker.ietf.org/doc/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}.
   * The OCI image specification defines [several of its own MIME types]{@link https://github.com/opencontainers/image-spec/blob/main/media-types.md} for resources defined in the specification.
   */
  mediaType: string;
  /**
   * This REQUIRED property is the digest of the targeted content, conforming to the requirements outlined in [Digests]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#digests}.
   * Retrieved content SHOULD be verified against this digest when consumed via untrusted sources.
   */
  digest: string;
  /**
   * This REQUIRED property specifies the size, in bytes, of the raw content.
   * This property exists so that a client will have an expected size for the content before processing.
   * If the length of the retrieved content does not match the specified length, the content SHOULD NOT be trusted.
   */
  size: number;
  /**
   * This OPTIONAL property specifies a list of URIs from which this object MAY be downloaded.
   * Each entry MUST conform to [RFC 3986]{@link https://tools.ietf.org/html/rfc3986}.
   * Entries SHOULD use the `http` and `https` schemes, as defined in [RFC 7230]{@link https://tools.ietf.org/html/rfc7230#section-2.7}.
   */
  urls?: string[];
  /**
   * This OPTIONAL property contains arbitrary metadata for this descriptor.
   * This OPTIONAL property MUST use the [annotation rules]{@link https://github.com/opencontainers/image-spec/blob/main/annotations.md#rules}.
   */
  annotations?: {
    [key: string]: string;
  };
  /**
   * This OPTIONAL property contains an embedded representation of the referenced content.
   * Values MUST conform to the Base 64 encoding, as defined in [RFC 4648]{@link https://tools.ietf.org/html/rfc4648#section-4}.
   * The decoded data MUST be identical to the referenced content and SHOULD be verified against the [`digest`]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#digests} and `size` fields by content consumers.
   * See [Embedded Content]{@link https://github.com/opencontainers/image-spec/blob/main/descriptor.md#embedded-content} for when this is appropriate.
   */
  data?: string;
  /**
   * This OPTIONAL property contains the type of an artifact when the descriptor points to an artifact.
   * This is the value of the config descriptor `mediaType` when the descriptor references an [image manifest]{@link https://github.com/opencontainers/image-spec/blob/main/manifest.md}.
   * If defined, the value MUST comply with [RFC 6838]{@link https://tools.ietf.org/html/rfc6838}, including the [naming requirements in its section 4.2]{@link https://tools.ietf.org/html/rfc6838#section-4.2}, and MAY be registered with [IANA]{@link https://www.iana.org/assignments/media-types/media-types.xhtml}.
   */
  artifactType?: string;
};
