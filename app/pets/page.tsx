import { PetCard } from "@/components/pet-card";
import { PetSearchForm } from "@/components/pet-search-form";
import { getPets, searchPets } from "@/data/pet";
import { Pet } from "@/types/pet";
import { createLoader, parseAsString } from "nuqs";

export const loadSearchParams = createLoader({
  name: parseAsString.withDefault(""),
});

export default async function PetsPage({ searchParams }: PageProps<"/pets">) {
  const { name } = await loadSearchParams(searchParams);
  const pets = name ? await searchPets(name) : await getPets();

  return (
    <div className="container py-10">
      <PetSearchForm />
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
