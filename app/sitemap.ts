import { fetchPropertiesData } from "./lib/data";

export default async function sitemap() {
    const baseUrl = "https://premproperties.com";

    // Static routes
    const routes = ["", "/about", "/properties", "/gallery", "/contact"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }));

    // Dynamic property routes
    try {
        const properties = await fetchPropertiesData();
        const propertyRoutes = properties.map((p: any) => ({
            url: `${baseUrl}/properties/${p.id}`,
            lastModified: p.updated_at || new Date(),
        }));
        return [...routes, ...propertyRoutes];
    } catch (e) {
        return routes;
    }
}
