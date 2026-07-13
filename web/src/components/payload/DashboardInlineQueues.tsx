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
    <section className="smn-dashboard-section">
      <div className="smn-section-heading">
        <div>
          <span className="smn-eyebrow">Resolve now</span>
          <h2>Top queue items</h2>
        </div>
        <small>Same audited actions as the ops workspaces</small>
      </div>
      <div className="smn-inline-queues">
        {mentors.length ? (
          <article>
            <h3>Mentor applications</h3>
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
            <h3>Pending opportunities</h3>
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
    </section>
  );
}
