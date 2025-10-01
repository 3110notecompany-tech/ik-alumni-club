import { PetForm } from "@/components/pet-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "新しいペットの登録",
};

export default function NewPage() {
  return (
    <div className="container py-10">
      <PetForm />
    </div>
  );
}
