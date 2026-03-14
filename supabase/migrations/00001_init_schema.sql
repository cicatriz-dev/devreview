-- DevReview schema: 4 tabelas principais

-- Times/Workspaces
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Regras de code review por time
create table review_rules (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  category text not null check (category in ('style', 'architecture', 'security', 'performance')),
  rule text not null,
  severity text not null check (severity in ('error', 'warning', 'info')),
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Histórico de reviews
create table review_history (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  pr_url text not null,
  pr_number int not null,
  repo text not null,
  review_summary text,
  issues_found int not null default 0,
  reviewed_at timestamptz default now()
);

-- ADRs (Architecture Decision Records)
create table adrs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  title text not null,
  context text not null,
  decision text not null,
  status text not null default 'proposed' check (status in ('proposed', 'accepted', 'deprecated')),
  created_at timestamptz default now()
);
