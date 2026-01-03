import { hashPassword } from './lib/password';
import { createClient } from '@supabase/supabase-js';

/**
 * Script to migrate plain text passwords to bcrypt hashed passwords
 * Run this once to hash all existing admin and member passwords
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePasswords() {
    console.log('🔐 Starting password migration...\n');

    try {
        // Migrate admin_users
        console.log('Migrating admin_users passwords...');
        const { data: admins, error: adminError } = await supabase
            .from('admin_users')
            .select('id, email, password');

        if (adminError) {
            console.error('Error fetching admin users:', adminError);
        } else if (admins) {
            for (const admin of admins) {
                // Check if already hashed
                if (!admin.password.startsWith('$2')) {
                    console.log(`  Hashing password for: ${admin.email}`);
                    const hashedPassword = await hashPassword(admin.password);

                    const { error: updateError } = await supabase
                        .from('admin_users')
                        .update({ password: hashedPassword })
                        .eq('id', admin.id);

                    if (updateError) {
                        console.error(`  ❌ Failed to update ${admin.email}:`, updateError);
                    } else {
                        console.log(`  ✅ Updated ${admin.email}`);
                    }
                } else {
                    console.log(`  ⏭️  Already hashed: ${admin.email}`);
                }
            }
        }

        // Migrate members
        console.log('\nMigrating members passwords...');
        const { data: members, error: memberError } = await supabase
            .from('members')
            .select('id, email, password');

        if (memberError) {
            console.error('Error fetching members:', memberError);
        } else if (members && members.length > 0) {
            for (const member of members) {
                if (member.password && !member.password.startsWith('$2')) {
                    console.log(`  Hashing password for: ${member.email}`);
                    const hashedPassword = await hashPassword(member.password);

                    const { error: updateError } = await supabase
                        .from('members')
                        .update({ password: hashedPassword })
                        .eq('id', member.id);

                    if (updateError) {
                        console.error(`  ❌ Failed to update ${member.email}:`, updateError);
                    } else {
                        console.log(`  ✅ Updated ${member.email}`);
                    }
                } else if (member.password) {
                    console.log(`  ⏭️  Already hashed: ${member.email}`);
                }
            }
        } else {
            console.log('  No members found');
        }

        console.log('\n✅ Password migration complete!');
        console.log('\n⚠️  IMPORTANT: All passwords are now hashed.');
        console.log('   Old plain text passwords will no longer work.');
        console.log('   Make sure to update your local .env if needed.\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migratePasswords()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
