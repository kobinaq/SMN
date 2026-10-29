import { createElement, isValidElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getVerifiedCertificate = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/lib/certificates", () => ({
  getVerifiedCertificate: (...args: unknown[]) => getVerifiedCertificate(...args),
}));

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children?: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));

import VerifyCertificatePage from "./page";

function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  if (isValidElement(node)) {
    return collectText((node.props as { children?: unknown }).children);
  }
  return "";
}

const validCertificate = {
  id: 1,
  title: "Community Builder",
  programName: "Think Social Academy",
  credentialCode: "TSA-ABC123",
  summary: "Completed the cohort.",
  skills: ["Facilitation"],
  pdfUrl: "",
  issuedAt: "2026-01-15T00:00:00.000Z",
  expiresAt: "",
  status: "valid" as const,
  verifyUrl: "/verify/TSA-ABC123",
  memberName: "Ama Mensah",
  memberHandle: "ama",
};

describe("VerifyCertificatePage", () => {
  beforeEach(() => {
    getVerifiedCertificate.mockReset();
    notFound.mockClear();
  });

  it("calls notFound when the credential code is unknown", async () => {
    getVerifiedCertificate.mockResolvedValueOnce(null);

    await expect(
      VerifyCertificatePage({ params: Promise.resolve({ code: "bad-code" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(getVerifiedCertificate).toHaveBeenCalledWith("bad-code");
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("renders the verified certificate for a valid code", async () => {
    getVerifiedCertificate.mockResolvedValueOnce(validCertificate);

    const tree = await VerifyCertificatePage({
      params: Promise.resolve({ code: "TSA-ABC123" }),
    });

    expect(notFound).not.toHaveBeenCalled();
    expect(getVerifiedCertificate).toHaveBeenCalledWith("TSA-ABC123");

    const text = collectText(tree);
    expect(text).toContain("Ama Mensah");
    expect(text).toContain("Community Builder");
    expect(text).toContain("TSA-ABC123");
    expect(text).toContain("Verified");
  });
});
