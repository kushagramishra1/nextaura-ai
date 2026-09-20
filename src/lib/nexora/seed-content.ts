export const SEED_KNOWLEDGE = [
  {
    name: "HR Policies",
    description: "Leave, onboarding, and people operations.",
    documents: [
      {
        title: "Employee Handbook",
        filename: "employee-handbook.md",
        content: `# Employee Handbook

## Annual leave
Full-time employees are entitled to 24 days of paid annual leave per calendar year, accrued monthly. Unused leave may be carried over up to a maximum of 5 days into the following year. Leave requests must be submitted in the HR portal at least 10 business days in advance except in emergencies.

Part-time employees accrue leave pro-rata based on contracted hours.

## Sick leave
Employees receive 10 days of paid sick leave per year. Absences longer than 3 consecutive days require a medical note. Sick leave does not carry over.

## Parental leave
Primary caregivers receive 16 weeks of paid parental leave. Secondary caregivers receive 4 weeks. Leave may begin up to 2 weeks before the expected date of birth or adoption.

## Working hours
Standard hours are 09:00–17:30 in the employee's local timezone, Monday to Friday. Core collaboration hours are 10:00–16:00. Remote employees must be reachable on Slack during core hours.

## Code of conduct
Harassment, discrimination, and retaliation are prohibited. Report concerns to People Ops or ethics@company.example. Retaliation against reporters is a fireable offense.
`,
      },
      {
        title: "Onboarding SOP",
        filename: "onboarding-sop.md",
        content: `# Onboarding SOP

This procedure applies to every new employee, contractor converted to FTE, and intern longer than 8 weeks.

## Before day one (T-5 to T-1)
People Ops creates the identity in Okta, assigns a laptop, and adds the hire to the all-hands and team mailing lists. The hiring manager nominates an onboarding buddy.

IT images the laptop with the standard engineering or business image and ships it to arrive the day before start, or stages it at the office.

## Day one
1. Welcome session with People Ops (30 minutes) covering handbook, payroll, and benefits enrollment.
2. Account activation: Okta, email, Slack, 1Password, and GitHub or equivalent.
3. Security briefing: MFA is mandatory. Phishing reports go to security@company.example.
4. Workspace tour or remote setup call with the buddy.
5. Manager 1:1 to agree on the 30/60/90 plan.

## After a new employee joins (days 2–14)
- Day 2: Product overview and access to the relevant Nexora knowledge bases.
- Day 3: Shadow a teammate on a live ticket or standup.
- Day 5: First small task merged or delivered.
- Day 10: Benefits enrollment deadline.
- Day 14: Checkpoint with manager and People Ops. Confirm equipment, access, and any blockers.

## 30 / 60 / 90
At 30 days the manager confirms role clarity. At 60 days the employee should independently own a workstream. At 90 days People Ops runs a stay interview and the manager files a probation review.

## Offboarding note
Do not use this SOP for offboarding. See the People Offboarding runbook.
`,
      },
    ],
  },
  {
    name: "Engineering Handbook",
    description: "Incidents, deployments, and production operations.",
    documents: [
      {
        title: "Incident Response SOP",
        filename: "incident-response.md",
        content: `# Incident Response SOP

## Severity
- SEV-1: customer-facing outage or data loss. Page the on-call immediately.
- SEV-2: major degradation, workaround exists. Respond within 15 minutes.
- SEV-3: limited impact. Handle in business hours.

## When a production deployment fails
An engineer should follow this sequence without waiting for a meeting:

1. Stop the pipeline. Do not retry a failed production deploy until the cause is known.
2. Roll back to the last known-good release using the deploy CLI: \`ship rollback production --to previous\`.
3. Confirm health checks on the status dashboard (error rate, p95 latency, queue depth).
4. If rollback does not restore service, page the incident commander via PagerDuty and open a #inc-YYYYMMDD Slack channel.
5. Capture the failing commit SHA, CI job URL, and error logs in the incident doc.
6. Communicate status in #eng-incidents every 15 minutes until mitigated.

Do not hot-patch production unless the incident commander approves. Feature flags may be used to disable the failing path.

## Incident commander
The primary on-call is incident commander until they hand off. The commander owns comms, rollback/forward decisions, and the post-incident review.

## Post-incident
A written PIR is due within 3 business days for SEV-1 and SEV-2. Action items get owners and dates. Blameless language is required.
`,
      },
      {
        title: "Deployment Runbook",
        filename: "deployment-runbook.md",
        content: `# Deployment Runbook

## Environments
- Preview: ephemeral per pull request.
- Staging: production-shaped, anonymized data.
- Production: EU-west and US-east, blue/green.

## Change window
Production deploys are allowed 10:00–16:00 local for the region, Monday–Thursday. Fridays require staff-engineer approval. No deploys during an open SEV-1.

## Standard deploy
1. CI must be green, including migration checks.
2. Staging bake for at least 20 minutes.
3. \`ship deploy production --sha $GIT_SHA\`.
4. Watch error budget for 15 minutes.
5. Announce in #eng-deploys.

## Database migrations
Expand/contract only. Never rename a column in the same deploy that changes application code to the new name. Backfills run from the worker, not the web process.

## Feature flags
All risky changes ship behind a flag defaulted off. Flags older than 30 days after full rollout must be removed.
`,
      },
    ],
  },
  {
    name: "Customer Support",
    description: "Refunds, enterprise accounts, and support SLAs.",
    documents: [
      {
        title: "Refund Policy",
        filename: "refund-policy.md",
        content: `# Refund Policy

## Self-serve (Free and Pro)
Customers on monthly Pro may request a refund within 14 days of the latest charge if usage is under 10% of the plan's request allotment. Annual Pro may be refunded pro-rata within 30 days of the initial annual charge only.

## Enterprise customers
Enterprise (Business plan and custom contracts) may request a refund within 30 days of the invoice date when:

- The service was unavailable below the contracted 99.9% monthly uptime, or
- The workspace was provisioned incorrectly (wrong region, wrong SSO) and could not be used, or
- The contract includes a written money-back clause.

Refund process for enterprise customers:

1. The account owner files a request in the billing portal or emails billing@company.example with the invoice number.
2. Support verifies the contract, invoice, and uptime credits already issued.
3. Finance approves refunds under $25,000. Larger refunds need the VP of Customer Success.
4. Refunds are issued to the original payment method within 10 business days.
5. Uptime credits are applied before cash refunds; we do not double-compensate the same incident.

Partial refunds are allowed when only a region or seat block was unusable. We do not refund professional services already delivered.

## Chargebacks
Open a ticket with Finance immediately. Do not argue the chargeback in the payment processor without Legal.
`,
      },
      {
        title: "Support Playbook",
        filename: "support-playbook.md",
        content: `# Support Playbook

## SLAs
- Enterprise: first response in 1 hour, 24/7 for SEV-1.
- Pro: first response in 4 business hours.
- Free: best effort, 1 business day.

## Escalation
If a customer reports a production outage, create a SEV using the Engineering incident SOP and stay in the incident channel as customer liaison. Do not promise ETAs that engineering has not confirmed.

## Tone
Be precise. Cite the relevant policy document when answering refunds, security, or data retention questions. If Nexora's knowledge base conflicts with a contract, the signed contract wins — flag it to Legal.
`,
      },
    ],
  },
] as const;
