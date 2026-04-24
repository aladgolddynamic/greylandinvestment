import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import "dotenv/config";

const prisma = new PrismaClient();

// Use Service Role Key for administrative actions (creating users without confirmation)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function syncUsers() {
  console.log('🚀 Starting Supabase Auth synchronization...');

  // 1. Fetch users from Prisma
  const prismaUsers = await prisma.user.findMany();
  console.log(`Found ${prismaUsers.length} users in Prisma database.`);

  for (const user of prismaUsers) {
    console.log(`\nProcessing: ${user.email}...`);

    // 2. Check if user already exists in Supabase Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing Supabase users:', listError.message);
      return;
    }

    const existingAuthUser = users.find(u => u.email === user.email);

    const tempPassword = 'Password123!';

    if (existingAuthUser) {
      console.log(`✔ User ${user.email} exists. Resetting password and updating metadata...`);
      
      await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, {
        password: tempPassword,
        user_metadata: { 
          name: user.name, 
          role: user.role,
          username: user.username
        }
      });
      console.log(`✨ Successfully updated ${user.email}. Password is now: ${tempPassword}`);
      continue;
    }

    // 3. Create user in Supabase Auth
    // NOTE: We use a default password because we cannot recover the plaintext from Prisma's hash
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm
      user_metadata: { 
        name: user.name, 
        role: user.role,
        username: user.username
      }
    });

    if (createError) {
      console.error(`❌ Failed to create ${user.email}:`, createError.message);
    } else {
      console.log(`✨ Successfully created ${user.email} in Supabase Auth.`);
      console.log(`👉 Temporary Password: ${tempPassword}`);
    }
  }

  console.log('\n✅ Sync complete.');
}

syncUsers()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
