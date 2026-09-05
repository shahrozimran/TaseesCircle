export const user = {
  id: "fixture-user",
  email: "member@example.test",
  user_metadata: { full_name: "Test Member" },
};
export const profile = {
  created_at: "2026-09-01T12:00:00Z",
  id: user.id,
  email: user.email,
  full_name: "Test Member",
  city: "Lahore",
  country: "Pakistan",
  role: "super_admin",
  current_masjid_id: "fixture-masjid",
};
const memberProfile = {
  created_at: "2026-09-01T12:00:00Z",
  id: "fixture-member",
  full_name: "Home",
  email: "other@example.test",
  role: "member",
};
const masjid = {
  id: "fixture-masjid",
  name: "Home",
  area: "Test Area",
  city: "Lahore",
  country: "Pakistan",
  zip_code: "54000",
  unique_code: "A7K3X9",
  member_count: 2,
  status: "approved",
  created_by: user.id,
  created_at: "2026-09-01T12:00:00Z",
  approved_at: "2026-09-02T12:00:00Z",
  description: "Original masjid description",
  profiles: profile,
};
const circle = {
  id: "fixture-circle",
  masjid_id: masjid.id,
  name: masjid.name,
  masjids: masjid,
};
masjid.circles = [{ id: circle.id }];
const tables = {
  profiles: [profile, memberProfile],
  masjids: [masjid],
  circles: [circle],
  masjid_members: [
    {
      id: "m1",
      user_id: user.id,
      masjid_id: masjid.id,
      role: "admin",
      joined_at: "2026-09-01T12:00:00Z",
      join_method: "code",
      profiles: profile,
    },
    {
      id: "m2",
      user_id: memberProfile.id,
      masjid_id: masjid.id,
      role: "member",
      joined_at: "2026-09-02T12:00:00Z",
      join_method: "referral",
      profiles: memberProfile,
    },
  ],
  notifications: [
    {
      id: "n1",
      user_id: user.id,
      title: "Masjid Approved! 🎉",
      message:
        'Your Masjid "Home" has been approved! Your circle code is: A7K3X9.',
      type: "approval",
      is_read: false,
      created_at: "2026-09-05T09:00:00Z",
    },
  ],
  circle_posts: [
    {
      id: "p1",
      circle_id: circle.id,
      author_id: user.id,
      user_id: user.id,
      title: "Original English post title",
      body: "Home",
      category: "General",
      created_at: "2026-09-05T08:00:00Z",
      profiles: profile,
      circle_post_reactions: [],
    },
  ],
  support_tickets: [
    {
      id: "t1",
      user_id: user.id,
      subject: "Original support subject",
      message: "My original support message.",
      priority: "medium",
      status: "open",
      recipient: "tasees_admin",
      created_at: "2026-09-05T08:00:00Z",
      profiles: profile,
      masjids: masjid,
      ticket_responses: [
        {
          id: "r1",
          response_message: "Original support response.",
          email_sent: true,
          created_at: "2026-09-05T09:00:00Z",
          profiles: profile,
        },
      ],
    },
  ],
};
export function createClient() {
  return {
    from(table) {
      let single = false;
      let filters = [];
      let proxy;
      proxy = new Proxy(
        {},
        {
          get(_, key) {
            if (key === "then")
              return (resolve) => {
                let data = tables[table] || [];
                for (const [k, v] of filters) {
                  if (data.some((d) => k in d))
                    data = data.filter((d) => d[k] === v);
                }
                return Promise.resolve({
                  data: single ? data[0] || null : data,
                  error: null,
                  count: data.length,
                }).then(resolve);
              };
            return (...args) => {
              if (key === "single" || key === "maybeSingle") single = true;
              if (key === "eq") filters.push(args);
              if (["update", "insert", "upsert"].includes(key)) {
                window.fixtureWrites ??= [];
                window.fixtureWrites.push({
                  table,
                  action: key,
                  values: args[0],
                });
              }
              return proxy;
            };
          },
        },
      );
      return proxy;
    },
    rpc: async () => ({ data: { success: true }, error: null }),
    channel() {
      return {
        on() {
          return this;
        },
        subscribe() {
          return this;
        },
      };
    },
    removeChannel() {},
    auth: { getUser: async () => ({ data: { user } }) },
  };
}
export function useAuth() {
  const mode = new URLSearchParams(location.search).get("mode");
  return {
    user,
    profile:
      mode === "empty" ? { ...profile, current_masjid_id: null } : profile,
    loading: false,
    isAdmin: true,
    isProfileComplete: mode !== "setup",
    signOut() {},
    refetchProfile: async () => profile,
    refreshProfile: async () => profile,
  };
}
