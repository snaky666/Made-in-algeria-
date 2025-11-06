create table leads (
  id bigserial primary key,
  platform text,
  identifier text,
  name text,
  bio text,
  location text,
  tags text[],
  score int default 0,
  status text default 'new',
  created_at timestamptz default now(),
  last_contacted_at timestamptz
);
