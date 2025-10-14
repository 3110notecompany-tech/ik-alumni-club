"use client";

import { deletePet } from "@/actions/pet";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function DeletePetButton({ petId }: { petId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        deletePet(petId);
        router.refresh();
      }}
    >
      ペットを削除
    </Button>
  );
}
