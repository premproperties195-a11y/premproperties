const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'company')
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Company Data in DB:', JSON.stringify(data.data.galleryImages, null, 2));
    }
}

check();
