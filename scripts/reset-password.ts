
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const targetEmail = 'atifjan2019@gmail.com';
    const newPassword = 'Test1234!';

    console.log(`\n🔑 Resetting password for ${targetEmail}...`);

    try {
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Try to update existing user
        const result = await prisma.user.updateMany({
            where: {
                email: targetEmail
            },
            data: {
                password: hashedPassword,
                role: 'ADMIN' // Ensure admin
            }
        });

        if (result.count > 0) {
            console.log(`✅ Success! Updated ${result.count} user(s).`);
            console.log(`\nTry logging in with:\nEmail: ${targetEmail}\nPassword: ${newPassword}`);
        } else {
            console.log(`⚠️ User ${targetEmail} NOT found. Creating new user...`);

            try {
                // MongoDB (or any provider) handles ID generation automatically via schema defaults
                await prisma.user.create({
                    data: {
                        email: targetEmail,
                        name: "Admin User",
                        password: hashedPassword,
                        role: "ADMIN"
                    }
                });
                console.log('✨ User created successfully!');
                console.log(`\nTry logging in with:\nEmail: ${targetEmail}\nPassword: ${newPassword}`);
            } catch (e) {
                console.error("Create failed:", e);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
