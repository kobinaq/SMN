import { beforeEach, describe, expect, it, vi } from "vitest";

const find = vi.fn();

vi.mock("@/lib/payload", () => ({
  getPayloadClient: vi.fn(async () => ({ find })),
}));

import { getVerifiedCertificate } from "@/lib/certificates";

describe("getVerifiedCertificate", () => {
  beforeEach(() => {
    find.mockReset();
    find.mockResolvedValue({ docs: [] });
  });

  it("normalises mixed-case codes to uppercase before the equals query", async () => {
    await getVerifiedCertificate("  smn-abc123def45678  ");

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          and: [
            { credentialCode: { equals: "SMN-ABC123DEF45678" } },
            { status: { equals: "valid" } },
            { visibility: { equals: "public" } },
          ],
        },
      }),
    );
  });

  it("returns null for blank input without querying", async () => {
    await expect(getVerifiedCertificate("   ")).resolves.toBeNull();
    expect(find).not.toHaveBeenCalled();
  });
});
