import { supabase } from './supabase';

export async function fetchCompanyData() {
    try {
        // Try Supabase first (from site_content table)
        const { data: dbData, error } = await supabase
            .from('site_content')
            .select('data')
            .eq('id', 'company')
            .single();

        if (dbData && !error) {
            return dbData.data;
        }

        // Fallback to local file - only on server
        if (typeof window === 'undefined') {
            try {
                const fs = (await import('fs')).default;
                const path = (await import('path')).default;
                const filePath = path.join(process.cwd(), 'app/data/company.json');
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(fileContent);
            } catch (e) {
                console.error('Local fallback failed:', e);
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching company data:', error);
        return null;
    }
}

export async function fetchPropertiesData() {
    try {
        const { data: dbProperties, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching properties data from Supabase:', error);
            return [];
        }

        return (dbProperties || []).map(p => ({
            ...p,
            id: String(p.id)
        }));
    } catch (error) {
        console.error('Error fetching properties data:', error);
        return [];
    }
}

export async function fetchPropertyById(propertyId: string | number) {
    try {
        const id = String(propertyId);
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching property by id from Supabase:', error);
            return null;
        }

        if (!data) return null;

        return {
            ...data,
            id: String(data.id)
        };
    } catch (error) {
        console.error('Error fetching property by id:', error);
        return null;
    }
}

export async function fetchStatsData() {
    try {
        const properties = await fetchPropertiesData();
        const companyData = await fetchCompanyData();

        const totalViews = properties.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

        return {
            properties: properties.length,
            team: companyData?.company?.team?.length || companyData?.team?.length || 0,
            views: totalViews,
        };
    } catch (error) {
        console.error('Error fetching stats data:', error);
        return { properties: 0, team: 0, views: 0 };
    }
}
