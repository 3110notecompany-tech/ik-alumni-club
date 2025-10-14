import { DeletePetButton } from "@/components/delete-pet-botton";
import { PetCard } from "@/components/pet-card";
import { PetForm } from "@/components/pet-form";
import { getPet } from "@/data/pet";
import { notFound, redirect } from "next/navigation";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function PetPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
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
