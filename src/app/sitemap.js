import { pakistanDiscussions } from "@/data/pakistan";
import { canadaDiscussions } from "@/data/canada";

const BASE_URL = "https://taseescircle.com";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/pakistan",
    "/canada",
    "/discussions",
    "/discussions/pakistan",
    "/discussions/canada",
    "/resources",
    "/contact",
    "/login",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const pakistanDiscussionRoutes = pakistanDiscussions.map((disc) => ({
    url: `${BASE_URL}/discussions/pakistan/${disc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const canadaDiscussionRoutes = canadaDiscussions.map((disc) => ({
    url: `${BASE_URL}/discussions/canada/${disc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...pakistanDiscussionRoutes,
    ...canadaDiscussionRoutes,
  ];
}
