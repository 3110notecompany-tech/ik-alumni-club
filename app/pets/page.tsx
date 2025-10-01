import { PetCard } from "@/components/pet-card";
import { Pet } from "@/types/pet";

export default function PetsPage() {
  const mockPets: Pet[] = [
    { id: "1", name: "Fido", type: "dog", hp: 80, ownerId: "owner1" },
    { id: "2", name: "Whiskers", type: "cat", hp: 70, ownerId: "owner2" },
    { id: "3", name: "Buddy", type: "dog", hp: 90, ownerId: "owner3" },
  ];
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">ペット一覧</h1>
      <div className="grid grid-cols-3 gap-4">
        {mockPets.map((pet) => (
          <div key={pet.id}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  );
}
