const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    console.log('Starting Supabase Seeding...');

    // 1. Seed Company Data
    try {
        const companyData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/company.json'), 'utf8'));
        const { error: companyError } = await supabase
            .from('site_content')
            .upsert({ id: 'company', data: companyData });

        if (companyError) console.error('Error seeding company:', companyError);
        else console.log('✅ Company data seeded');
    } catch (e) {
        console.error('Failed to read company.json');
    }

    // 2. Seed Properties
    try {
        const propertiesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/properties.json'), 'utf8'));
        // Clean properties (remove manual IDs if they are not bigint compatible or just let supabase handle it)
        const cleanProperties = propertiesData.map(p => {
            const { id, ...rest } = p;
            return rest;
        });

        const { error: propError } = await supabase
            .from('properties')
            .insert(cleanProperties);

        if (propError) console.error('Error seeding properties:', propError);
        else console.log('✅ Properties seeded');
    } catch (e) {
        console.error('Failed to read properties.json');
    }

    // 3. Seed Inquiries
    try {
        const inquiriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/inquiries.json'), 'utf8'));
        const cleanInquiries = inquiriesData.map(i => {
            const { id, ...rest } = i;
            return rest;
        });

        const { error: inqError } = await supabase
            .from('inquiries')
            .insert(cleanInquiries);

        if (inqError) console.error('Error seeding inquiries:', inqError);
        else console.log('✅ Inquiries seeded');
    } catch (e) {
        console.error('Failed to read inquiries.json');
    }

    console.log('Seeding Finished!');
}

seed();
