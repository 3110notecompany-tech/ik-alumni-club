import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function UserCard({ user }: { user: User }) {
  return (
    <Card className="max-w-sm mx-auto">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-lg font-bold">{user.name}</h1>
          <p className="text-sm break-all text-muted-foreground t">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}