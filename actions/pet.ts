"use server";
import { db } from "@/db";
import { pets } from "@/db/schemas/pet";
import { verifySession } from "@/lib/session";
import { PetFormData } from "@/types/pet";
import { petFormSchema } from "@/zod/pet";
import { and, eq } from "drizzle-orm";

export async function createPet(formData: PetFormData) {
    const data = petFormSchema.parse(formData);
    const session = await verifySession();
    const ownerId = session.user.id;

    await db.insert(pets).values({ ...data, ownerId }).returning();
}

export async function updatePet(id: string, formData: PetFormData) {
    const data = petFormSchema.parse(formData);
    const session = await verifySession();
    const ownerId = session.user.id;

    await db.update(pets)
        .set({ ...data, ownerId })
        .where(
            and(eq(pets.id, id), eq(pets.ownerId, ownerId)));
}

export async function deletePet(id: string) {
    const session = await verifySession();
    const ownerId = session.user.id;

    await db.delete(pets).where(
        and(eq(pets.id, id), eq(pets.ownerId, ownerId)));
}
