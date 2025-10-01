import { Pet, PetType } from "@/types/pet";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const getPetTypeLabel = (type: PetType) => {
  const typeMap: Record<PetType, string> = {
    dog: "犬",
    cat: "猫",
  };
  return typeMap[type] || type;
};

function getHpStatus(hp: number) {
  if (hp >= 80) return { label: "元気", color: "bg-green-500" };
  if (hp >= 50) return { label: "普通", color: "bg-yellow-500" };
  if (hp >= 20) return { label: "注意", color: "bg-orange-500" };
  return { label: "危険", color: "bg-red-500" };
}

export function PetCard({ pet }: { pet: Pet }) {
  const hpStatus = getHpStatus(pet.hp);

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="text-lg font-bold">{pet.name}</h1>
        <p className="text-muted-foreground text-sm break-all">
          {getPetTypeLabel(pet.type)}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">HP</span>
            <span className="text-sm font-medium">{hpStatus.label} ({pet.hp}/100)</span>
          </div>
          <Progress value={pet.hp} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
