-- Fitsta Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 전체를 붙여넣고 Run 하세요.

-- ── profiles: auth.users 1:1 ──
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text default '',
  bio text default '',
  streak_count int default 0,
  daily_calorie_goal int default 2000,
  daily_exercise_goal int default 60,
  height numeric,
  weight numeric,
  activity_level text default 'moderate',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- 회원가입 시 auth.users에 들어간 메타데이터(username, display_name)로 profiles 행 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── posts ──
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  caption text default '',
  image_url text,
  category text not null check (category in ('workout', 'diet')),
  routine_data jsonb default '[]',
  likes_count int default 0,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;
create policy "posts_select_all" on public.posts for select using (true);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

-- ── follows ──
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;
create policy "follows_select_all" on public.follows for select using (true);
create policy "follows_insert_own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete_own" on public.follows for delete using (auth.uid() = follower_id);

-- ── foods: 유저가 직접 입력한 음식(다른 유저도 검색해서 볼 수 있음) ──
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  calories int not null,
  serving text default '1인분',
  category text default '기타',
  emoji text default '🍽️',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.foods enable row level security;
create policy "foods_select_all" on public.foods for select using (true);
create policy "foods_insert_authenticated" on public.foods for insert with check (auth.uid() is not null);
