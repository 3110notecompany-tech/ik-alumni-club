import { db } from "@/db";
import { pets } from "@/db/schemas/pet";
import { eq } from "drizzle-orm";
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