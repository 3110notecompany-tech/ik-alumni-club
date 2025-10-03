"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petFormSchema } from "@/zod/pet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { z } from "better-auth";
import { createPet, updatePet } from "@/actions/pet";
import { toast } from "sonner";
import { Pet } from "@/types/pet";

type PetFormData = z.infer<typeof petFormSchema>;

export function PetForm({ defaultValues }: { defaultValues?: Pet }) {
  const router = useRouter();
  const form = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      type: "dog",
      hp: 50,
    },
  });

  async function onSubmit(data: PetFormData) {
    try {
      if (defaultValues) {
        await updatePet(defaultValues.id, data);
      } else {
        await createPet(data);
      }
      toast(`ペットが${defaultValues ? "更新" : "作成"}されました`, {
        description: `${data.name}を${defaultValues ? "更新" : "追加"}しました`,
      });
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `ペットの${defaultValues ? "更新" : "作成"}に失敗しました`,
      });
      console.error(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ペットの名前</FormLabel>
              <FormControl>
                <Input placeholder="例；ぽち" {...field} />
              </FormControl>
              <FormDescription>ペットの名前を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>種類</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ペットの種類を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dog">犬</SelectItem>
                  <SelectItem value="cat">猫</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>ペットの種類を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HP</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="50"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                HPは0から100の間で入力してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {defaultValues ? "ペットを更新" : "ペットを追加"}
        </Button>
      </form>
    </Form>
  );
}
