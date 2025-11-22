import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BASE_URL = "https://cakenews.vercel.app";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const generateSitemap = async () => {
  console.log("Generating sitemap...");
  
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

    // Write to public folder
    const publicDir = path.resolve(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    
    console.log(`Sitemap generated with ${staticRoutes.length + dynamicRoutes.length} URLs`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
};

generateSitemap();
