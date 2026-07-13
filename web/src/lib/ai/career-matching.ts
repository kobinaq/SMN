export type CareerOpportunity = { id: string | number; title: string; slug: string; company: string; summary: string; description?: string | null; type: string; workMode: string; experienceLevel: string; location: string };
export type CareerProfile = { headline?: string | null; bio?: string | null; location?: string | null; skills: string[]; learning: string[]; certificates: string[]; portfolioSkills: string[]; goals?: string | null };
export type OpportunityMatch = CareerOpportunity & { score: number; matches: string[]; gaps: string[]; relevantLearning: string[] };
const stop = new Set(["and", "the", "with", "for", "from", "that", "this", "your", "you", "our", "are", "will", "have", "has", "job", "role"]);
const tokens = (value: string) => new Set((value.toLowerCase().match(/[a-z0-9+#.-]{3,}/g) || []).filter(token => !stop.has(token)));

export function matchOpportunities(profile: CareerProfile, opportunities: CareerOpportunity[]): OpportunityMatch[] {
  const explicitSkills = [...profile.skills, ...profile.portfolioSkills];
  const profileTokens = tokens([profile.headline, profile.bio, profile.location, profile.goals, explicitSkills.join(" "), profile.learning.join(" "), profile.certificates.join(" ")].filter(Boolean).join(" "));
  return opportunities.map(opportunity => {
    const roleTokens = tokens(`${opportunity.title} ${opportunity.summary} ${opportunity.description || ""}`);
    const overlap = [...roleTokens].filter(token => profileTokens.has(token));
    const explicitMatches = explicitSkills.filter(skill => { const skillTokens = tokens(skill); return [...skillTokens].some(token => roleTokens.has(token)); }).slice(0, 8);
    const locationMatch = opportunity.workMode === "Remote" || Boolean(profile.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase()));
    const gaps = [...roleTokens].filter(token => !profileTokens.has(token)).filter(token => token.length > 4).slice(0, 5);
    const relevantLearning = profile.learning.filter(item => [...tokens(item)].some(token => roleTokens.has(token))).slice(0, 4);
    const raw = overlap.length * 7 + explicitMatches.length * 10 + (locationMatch ? 8 : 0) + (opportunity.experienceLevel === "Any level" ? 4 : 0);
    return { ...opportunity, score: Math.min(100, raw), matches: [...new Set([...explicitMatches, ...overlap.slice(0, 6)])], gaps, relevantLearning };
  }).sort((a, b) => b.score - a.score || String(a.title).localeCompare(String(b.title)));
}
