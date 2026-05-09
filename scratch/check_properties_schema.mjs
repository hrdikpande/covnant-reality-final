import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env
const envPath = path.join(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
        env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
    }
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function checkSchema() {
    const { data, error } = await supabase.from('properties').select('*').limit(1);
    if (error) {
        console.error('Error fetching properties:', error);
        return;
    }
    if (data && data.length > 0) {
        console.log('Columns in properties table:', Object.keys(data[0]));
    } else {
        console.log('No data in properties table.');
    }
}

checkSchema();
