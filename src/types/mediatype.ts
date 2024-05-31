export enum MediaType {
  DESCRIPTOR = "application/vnd.oci.descriptor.v1+json",
  LAYOUT = "application/vnd.oci.layout.header.v1+json",
  IMAGE_INDEX = "application/vnd.oci.image.index.v1+json",
  IMAGE_MANIFEST = "application/vnd.oci.image.manifest.v1+json",
  IMAGE_CONFIG = "application/vnd.oci.image.config.v1+json",
  IMAGE_LAYER_TAR = "application/vnd.oci.image.layer.v1.tar",
  IMAGE_LAYER_TAR_GZIP = "application/vnd.oci.image.layer.v1.tar+gzip",
  IMAGE_LAYER_TAR_ZSTD = "application/vnd.oci.image.layer.v1.tar+zstd",
  IMAGE_LAYER_EMPTY = "application/vnd.oci.empty.v1+json",
}
