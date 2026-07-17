"use client";

import { MentorDecision } from "./MentorshipActions";
import { OpportunityActions } from "./OpportunityActions";

type MentorItem = { id: string | number; title: string; detail: string };
type OpportunityItem = { id: string | number; title: string; detail: string; status: string };

export function DashboardInlineQueues({
  mentors,
  opportunities,
}: {
  mentors: MentorItem[];
  opportunities: OpportunityItem[];
}) {
  if (!mentors.length && !opportunities.length) return null;

  return (
    <div className="smn-inline-queues grid gap-4 lg:grid-cols-2">
      {mentors.length ? (
        <article>
          <h3 className="mb-2 text-sm font-medium text-white/70">Mentor applications</h3>
          {mentors.map((item) => (
            <div className="smn-ops-row" key={item.id}>
              <div>
                <b>{item.title}</b>
                <span>{item.detail}</span>
              </div>
              <MentorDecision mentorId={item.id} />
            </div>
          ))}
        </article>
      ) : null}
      {opportunities.length ? (
        <article>
          <h3 className="mb-2 text-sm font-medium text-white/70">Pending jobs</h3>
          {opportunities.map((item) => (
            <div className="smn-ops-row" key={item.id}>
              <div>
                <b>{item.title}</b>
                <span>{item.detail}</span>
              </div>
              <OpportunityActions opportunityId={item.id} current={item.status} />
            </div>
          ))}
        </article>
      ) : null}
    </div>
  );
}
