import { PetCard } from "@/components/pet-card";
import { getPets } from "@/data/pet";
import { Pet } from "@/types/pet";

export default async function PetsPage() {
  const pets = await getPets();

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">ペット一覧</h1>
      <div className="grid grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  );
}
