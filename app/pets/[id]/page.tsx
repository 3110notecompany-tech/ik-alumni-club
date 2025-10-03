import { getPet } from "@/data/pet";

export default async function PetPage() {
  const pet = await getPet(id);
  return <div>Pet Detail Page</div>;
}
