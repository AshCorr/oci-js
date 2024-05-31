import { before, describe, it } from "node:test";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { Registry } from "../src/registry";

describe("Integration test", () => {
  let registryContainer: StartedTestContainer;
  let registry: Registry;

  before(async () => {
    registryContainer = await new GenericContainer("registry:2.8.3")
      .withExposedPorts(5000)
      .start();

    registry = new Registry(
      `http://${registryContainer.getHost()}:${registryContainer.getMappedPort(
        5000
      )}`
    );
  });
});
