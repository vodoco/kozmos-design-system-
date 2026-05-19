import { Verifier } from "@pact-foundation/pact";
import http from "node:http";
import type { AddressInfo } from "node:net";
import path from "path";

const poiFixture = {
  id: "native-poi-1",
  title: "Level 2 Conference Room",
  category: "Meeting Space",
  description: "Equipped with Apple TV and Whiteboard",
  imageUrl: "https://example.com/assets/conference.jpg",
};

const startProvider = async () => {
  const server = http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/v1/pois/native-poi-1") {
      response.writeHead(200, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(poiFixture));
      return;
    }

    response.writeHead(404, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Not found" }));
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });

  return server;
};

const closeProvider = async (server: http.Server) => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

export const verifyProvider = async () => {
  const providerServer = await startProvider();
  const { port } = providerServer.address() as AddressInfo;

  const verifier = new Verifier({
    providerBaseUrl: `http://127.0.0.1:${port}`,
    provider: "Pointr_Places_API",
    pactUrls: [
      // Path properly intercepting Consumer Pact Outputs mapping correctly
      path.resolve(
        process.cwd(),
        "pacts/KozmosUI_POICard-Pointr_Places_API.json",
      ),
    ],
    publishVerificationResult: process.env.CI === "true",
    providerVersion: process.env.GITHUB_SHA || "1.0.0",
    stateHandlers: {
      "": async () => undefined,
    },
  });

  try {
    await verifier.verifyProvider();
    console.log("Pact verification successful!");
  } finally {
    await closeProvider(providerServer);
  }
};

// Execute the verification
verifyProvider().catch((error) => {
  console.error("Pact verification failed:", error);
  process.exitCode = 1;
});
