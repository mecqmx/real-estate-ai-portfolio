// admin-cli.js
// This CLI script allows user management (create ADMIN, change role, delete)
// directly from the command line. It's a "super admin" tool for emergency
// situations or initial setup in production.

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // For hashing passwords
const readline = require('readline'); // For user input in the console

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask the user a question in the console
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("\n--- Super Admin CLI Tool ---");
  console.log("1. Create new ADMIN user");
  console.log("2. Change user role");
  console.log("3. Delete user");
  console.log("4. Exit");

  const choice = await askQuestion("Enter your choice (1-4): ");

  try {
    switch (choice.trim()) {
      case '1':
        await createAdminUser();
        break;
      case '2':
        await changeUserRole();
        break;
      case '3':
        await deleteUser();
        break;
      case '4':
        console.log("Exiting CLI tool.");
        break;
      default:
        console.log("Invalid choice. Please enter a number between 1 and 4.");
    }
  } catch (error) {
    console.error("\nAn error occurred:", error.message);
    if (error.code) {
      console.error("Prisma Error Code:", error.code);
    }
  } finally {
    rl.close(); // Close the readline interface
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
}

// --- Funcionalidad 1: Crear nuevo usuario ADMIN ---
async function createAdminUser() {
  console.log("\n--- Create New ADMIN User ---");
  const name = await askQuestion("Enter user name (optional): ");
  const email = await askQuestion("Enter user email: ");
  const password = await askQuestion("Enter user password: ");

  if (!email || !password) {
    console.error("Email and password are required.");
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.error(`User with email "${email}" already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const newUser = await prisma.user.create({
    data: {
      name: name || null,
      email,
      hashedPassword,
      role: 'ADMIN', // Directly assign ADMIN role
    },
  });
  console.log(`\nADMIN user "${newUser.email}" created successfully!`);
}

// --- Funcionalidad 2: Cambiar rol de usuario ---
async function changeUserRole() {
  console.log("\n--- Change User Role ---");
  const email = await askQuestion("Enter email of the user to modify: ");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User with email "${email}" not found.`);
    return;
  }

  console.log(`Current role for ${user.email}: ${user.role}`);
  const newRole = await askQuestion("Enter new role (CLIENT, AGENT, ADMIN): ");

  if (!['CLIENT', 'AGENT', 'ADMIN'].includes(newRole.toUpperCase())) {
    console.error("Invalid role. Please choose CLIENT, AGENT, or ADMIN.");
    return;
  }

  // Self-demotion prevention: This script doesn't allow changing the role of the logged-in user.
  // This is an additional layer; the API already prevents this for the logged-in admin.
  // Here, it's more to prevent an admin from accidentally demoting themselves if this script
  // were run by an admin who is not logged into the web app.
  // In this CLI context, we don't have a logged-in user "session".

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: newRole.toUpperCase(),
      updatedAt: new Date(), // Ensure updatedAt is updated
    },
  });
  console.log(`\nUser "${updatedUser.email}" role changed to "${updatedUser.role}" successfully!`);
}

// --- Funcionalidad 3: Eliminar usuario ---
async function deleteUser() {
  console.log("\n--- Delete User ---");
  const email = await askQuestion("Enter email of the user to delete: ");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User with email "${email}" not found.`);
    return;
  }

  const confirmation = await askQuestion(`Are you sure you want to delete user "${user.email}"? Type 'yes' to confirm: `);
  if (confirmation.toLowerCase() !== 'yes') {
    console.log("User deletion cancelled.");
    return;
  }

  // Considerations for deleting a user:
  // If the user has associated properties and you don't have onDelete: Cascade configured in Prisma for properties,
  // the deletion will fail. For NextAuth, the Account and Session relations usually have onDelete: Cascade.

  await prisma.user.delete({ where: { id: user.id } });
  console.log(`\nUser "${user.email}" deleted successfully.`);
}

main();