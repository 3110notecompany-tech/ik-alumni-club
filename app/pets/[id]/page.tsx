import { DeletePetButton } from "@/components/delete-pet-botton";
import { PetCard } from "@/components/pet-card";
import { PetForm } from "@/components/pet-form";
import { getPet } from "@/data/pet";
import { notFound, redirect } from "next/navigation";

export default async function PetPage({ params }: PageProps<"/pets/[id]">) {
  const petId = (await params).id;
  const pet = await getPet(petId);

  if (!pet) {
    redirect("/pets");
  }
  return (
    <div className="container">
      <PetCard pet={pet} />

      <PetForm defaultValues={pet} />

      <DeletePetButton petId={pet.id} />
    </div>
  );
}
