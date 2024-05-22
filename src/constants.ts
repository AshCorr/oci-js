export enum MediaType {
    DESCRIPTOR = "application/vnd.oci.descriptor.v1+json",
    LAYOUT = "application/vnd.oci.layout.header.v1+json",
    IMAGE_INDEX = "application/vnd.oci.image.index.v1+json",
    IMAGE_MANIFEST = "application/vnd.oci.image.manifest.v1+json",
    IMAGE_CONFIG = "application/vnd.oci.image.config.v1+json",
    IMAGE_LAYER_TAR = "application/vnd.oci.image.layer.v1.tar",
    IMAGE_LAYER_TAR_GZIP = "application/vnd.oci.image.layer.v1.tar+gzip",
    IMAGE_LAYER_TAR_ZSTD = "application/vnd.oci.image.layer.v1.tar+zstd",
    IMAGE_LAYER_EMPTY = "application/vnd.oci.empty.v1+json"
}

export enum Annotation {
    CREATED = "org.opencontainers.image.created",
    AUTHORS = "org.opencontainers.image.authors",
    URL = "org.opencontainers.image.url",
    DOCUMENTATION = "org.opencontainers.image.documentation",
    SOURCE = "org.opencontainers.image.source",
    VERSION = "org.opencontainers.image.version",
    REVISION = "org.opencontainers.image.revision",
    VENDOR = "org.opencontainers.image.vendor",
    LICENSES = "org.opencontainers.image.licenses",
    REF_NAME = "org.opencontainers.image.ref.name",
    TITLE = "org.opencontainers.image.title",
    DESCRIPTION = "org.opencontainers.image.description",
    BASE_DIGEST = "org.opencontainers.image.base.digest",
    BASE_NAME = "org.opencontainers.image.base.name"
}