import { PetCard } from "@/components/pet-card";
import { PetForm } from "@/components/pet-form";
import { getPet } from "@/data/pet";
import { notFound } from "next/navigation";

export default async function PetPage({ params }: PageProps<"/pets/[id]">) {
  const petId = (await params).id;
  const pet = await getPet(petId);

  if (!pet) {
    notFound();
  }
  return (
    <div className="container">
      <PetCard pet={pet} />

      <PetForm defaultValues={pet} />
    </div>
  );
}
