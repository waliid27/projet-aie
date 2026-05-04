import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { Category } from "./entities/Category";
import { User } from "./entities/User";
import { UserRole } from "./enums/UserRole";

dotenv.config();

const defaultCategories = [
  { name: "Informatique", description: "Cours, projets et livres informatiques" },
  { name: "Mathematiques", description: "Documents de mathematiques" },
  { name: "Gestion", description: "Documents de gestion et economie" },
  { name: "Langues", description: "Documents de langues" },
  { name: "Autres", description: "Autres documents PDF" },
];

const run = async () => {
  await AppDataSource.initialize();

  const categoryRepository = AppDataSource.getRepository(Category);
  const userRepository = AppDataSource.getRepository(User);

  for (const categoryData of defaultCategories) {
    const exists = await categoryRepository.findOne({ where: { name: categoryData.name } });
    if (!exists) {
      await categoryRepository.save(categoryRepository.create(categoryData));
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_FULL_NAME || "Administrateur";

  let admin = await userRepository.findOne({ where: { email: adminEmail } });

  if (!admin) {
    admin = userRepository.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log(`Admin cree: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin existe deja: ${adminEmail}`);
  }

  console.log("Seed termine");
  await AppDataSource.destroy();
};

run().catch(async (error) => {
  console.error(error);
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
