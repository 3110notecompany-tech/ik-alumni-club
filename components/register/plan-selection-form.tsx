"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { planSelectionFormSchema, type PlanSelectionFormData } from "@/zod/plan-selection";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
import type { MemberPlan } from "@/types/member-plan";
import { RegistrationProgress } from "./registration-progress";

type PlanSelectionFormProps = {
  plans: MemberPlan[];
};

export function PlanSelectionForm({ plans }: PlanSelectionFormProps) {
  const router = useRouter();
  const { setSelectedPlanId, termsAgreed } = useRegistration();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PlanSelectionFormData>({
    resolver: zodResolver(planSelectionFormSchema),
  });

  // 会員規約に同意していない場合はリダイレクト
  useEffect(() => {
    if (!termsAgreed) {
      router.push("/register/terms");
    }
  }, [termsAgreed, router]);

  // リダイレクト中は何も表示しない
  if (!termsAgreed) {
    return null;
  }

  const onSubmit = async (data: PlanSelectionFormData) => {
    setIsLoading(true);
    try {
      // 選択されたプランを取得
      const selectedPlan = plans.find(p => p.id === data.planId);

      // stripePriceIdが存在しない場合はエラー
      if (selectedPlan && !selectedPlan.stripePriceId) {
        console.error("Selected plan does not have a Stripe Price ID");
        form.setError("planId", {
          message: "選択されたプランは現在ご利用いただけません。別のプランをお選びください。"
        });
        setIsLoading(false);
        return;
      }

      setSelectedPlanId(data.planId);
      router.push("/register/auth");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegistrationProgress currentStep={2} className="mb-8" />
      <Card>
      <CardHeader>
        <CardTitle>会員プラン選択</CardTitle>
        <CardDescription>
          ご希望のプランを選択してください。プランは後から変更することも可能です。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      className="grid gap-4 md:grid-cols-2"
                    >
                      {plans.map((plan) => {
                        const features: string[] = plan.features || [];

                        return (
                          <div key={plan.id}>
                            <RadioGroupItem
                              value={plan.id.toString()}
                              id={`plan-${plan.id}`}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={`plan-${plan.id}`}
                              className="flex flex-col cursor-pointer rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="font-semibold text-lg" style={{ color: plan.color || undefined }}>
                                    {plan.displayName}
                                  </h3>
                                  {plan.isBusinessPlan && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-1 inline-block">
                                      法人向け
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    ¥{Number(plan.price).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    /月
                                  </div>
                                </div>
                              </div>

                              {plan.description && (
                                <p className="text-sm text-muted-foreground mb-4">
                                  {plan.description}
                                </p>
                              )}

                              {features.length > 0 && (
                                <ul className="space-y-2 text-sm">
                                  {features.map((feature: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                      <Check className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => router.push("/register/terms")}
              >
                戻る
              </Button>
              <Button type="submit" className="min-h-11" disabled={isLoading}>
                {isLoading ? "処理中..." : "次へ"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
    </>
  );
}
