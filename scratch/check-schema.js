require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function test() {
    try {
        const { data } = await supabaseAdmin.from('PageContent').select('*').limit(1);
        console.log('PageContent columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');
        if (data && data.length > 0) console.log('PageContent sample:', data[0]);
    } catch (e) {
        console.error('Catch error:', e);
    }
}
test();
