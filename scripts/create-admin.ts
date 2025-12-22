// Script to create initial Super Admin user with hashed password
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

async function createInitialAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = {
        users: [
            {
                id: "1",
                username: "admin",
                email: "admin@premproperties.com",
                password: hashedPassword,
                role: "super_admin",
                permissions: ["all"],
                createdAt: new Date().toISOString(),
                lastLogin: null,
                active: true
            }
        ]
    };

    const filePath = path.join(process.cwd(), 'app/data/users.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    console.log('✅ Initial admin user created!');
    console.log('Email: admin@premproperties.com');
    console.log('Password: admin123');
    console.log('Hashed password:', hashedPassword);
}

createInitialAdmin().catch(console.error);
