const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log('--- Site Content (Company) ---');
    const { data: siteData, error: siteError } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'company')
        .single();

    if (siteError) console.error('Site Error:', siteError);
    else console.log('Gallery Images:', siteData.data.galleryImages);

    console.log('\n--- Properties ---');
    const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('id, title, image, images');

    if (propError) console.error('Prop Error:', propError);
    else {
        propData.forEach(p => {
            console.log(`ID: ${p.id} | Title: ${p.title}`);
            console.log(`Main Image: ${p.image}`);
            console.log(`Additional Images: ${p.images}\n`);
        });
    }
}

check();
