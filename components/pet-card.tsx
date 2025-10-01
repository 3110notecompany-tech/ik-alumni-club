import { Pet } from "@/types/pet";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <Card>
      <CardContent>
        <h1 className="text-lg font-bold">{pet.name}</h1>
        <p
          className="text=muted-foreground t
        ext-sm break-all"
        >
          {pet.type}
        </p>
        <p className="text=muted-foreground text-sm break-all">{pet.hp}</p>
      </CardContent>
    </Card>
  );
}
