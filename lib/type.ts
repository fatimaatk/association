import { prisma } from "./prisma";

export async function getTypesFamilles() {
  const types = await prisma.typeFamille.findMany();
  return types;
}
