import { getPayloadClient } from "@/lib/payload";

export type MentorDirectoryItem = {
  id: string | number;
  name: string;
  title: string;
  bio: string;
  topics: string[];
  seniority: string;
  availability: string;
  location: string;
  imageUrl: string | null;
};

export async function getApprovedMentors(): Promise<MentorDirectoryItem[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "mentors", depth: 2, limit: 100, sort: "-featured,title",
    where: { status: { equals: "approved" } }, overrideAccess: true,
  });
  return result.docs.map((doc) => {
    const member = typeof doc.member === "object" && doc.member ? doc.member : null;
    const avatar = member && typeof member.avatar === "object" && member.avatar ? member.avatar : null;
    return {
      id: doc.id, name: member?.name || "SMN mentor", title: doc.title, bio: doc.bio,
      topics: doc.topics || [], seniority: doc.seniority, availability: doc.availability,
      location: member?.location || "",
      imageUrl: avatar && "url" in avatar ? avatar.url || null : null,
    };
  });
}
export async function getMentorApplicationStatus(memberId: string | number) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "mentors", depth: 0, limit: 1,
    where: { member: { equals: memberId } }, overrideAccess: true,
  });
  return result.docs[0]?.status || null;
}