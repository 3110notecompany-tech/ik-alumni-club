import { db } from "@/db";
import { pets } from "@/db/schemas/pet";
import { verifySession } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import "server-only";

export const getPets = async () => {
    return db.query.pets.findMany(
        //     {
        //     columns: { id: true, name: true, },
        // }
    );
}

export const getPet = async (id: string) => {
    return db.query.pets.findFirst({
        where: eq(pets.id, id),
    });
}

export const isPetOwner = async (id: string) => {
    const session = await verifySession();
    const ownerId = session.user.id;

    const pet = await db.query.pets.findFirst({
        where: and(eq(pets.id, id), eq(pets.ownerId, ownerId)),
    });

    return pet !== undefined;
}