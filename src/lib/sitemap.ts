import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://cakenews.vercel.app"; // TODO: Update with real domain

export const generateSitemap = async () => {
  try {
    // 1. Static Routes
    const staticRoutes = [
      "",
      "/auth",
      "/admin",
    ];

    // 2. Dynamic Routes (Articles)
    const { data: articles } = await supabase
      .from("articles")
      .select("id, updated_at")
      .eq("published", true);

    const dynamicRoutes = (articles || []).map((article) => ({
      url: `/article/${article.id}`,
      lastModified: article.updated_at,
    }));

    // 3. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    staticRoutes.forEach((route) => {
      xml += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add dynamic routes
    dynamicRoutes.forEach((route) => {
      xml += `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${new Date(route.lastModified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return "";
  }
};
