"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const gradeConvertedFormSchema = z.object({
  minGrade: z.number().int().min(0).default(0),
  maxGrade: z.number().int().min(0),
  minResultGrade: z.number().int().min(0).default(0),
  maxResultGrade: z.number().int().min(0),
  grade: z.number().int().min(0),
});

const useGradeConverterForm = () => {
  const form = useForm<z.infer<typeof gradeConvertedFormSchema>>({
    resolver: zodResolver(gradeConvertedFormSchema),
    defaultValues: {
      minGrade: 0,
      maxGrade: 100,
      minResultGrade: 0,
      maxResultGrade: 12,
      grade: 0,
    },
  });

  return form;
};

const mapGrade = (
  grade: number,
  minGrade: number,
  maxGrade: number,
  minResultGrade: number,
  maxResultGrade: number
) => {
  const result =
    ((grade - minGrade) / (maxGrade - minGrade)) *
      (maxResultGrade - minResultGrade) +
    minResultGrade;

  return Number(result.toFixed(2));
};

export default function GradeConverter() {
  const form = useGradeConverterForm();

  const minGrade = form.watch("minGrade");
  const maxGrade = form.watch("maxGrade");
  const minResultGrade = form.watch("minResultGrade");
  const maxResultGrade = form.watch("maxResultGrade");
  const grade = form.watch("grade");

  const [result, setResult] = useState<number | null>(null);

  // const [view, setView] = useQueryState(
  //   "view",
  //   parseAsStringLiteral(["form", "slider"] as const).withDefault("form")
  // );

  const [scale, setScale] = useQueryState(
    "scale",
    parseAsStringLiteral(["0_100", "0_50", "0_25"] as const).withDefault("0_50")
  );

  const globalConfig = useMemo(() => {
    const [min, max] = (scale || "0_50").split("_").map(Number);

    return {
      min,
      max,
    };
  }, [scale]);

  const submitHandler = form.handleSubmit(
    (data) => {
      setResult(null);

      const result = mapGrade(
        data.grade,
        data.minGrade,
        data.maxGrade,
        data.minResultGrade,
        data.maxResultGrade
      );

      setResult(result);
    },
    (error) => {
      console.error(error);
    }
  );

  useEffect(() => {
    form.setValue("minGrade", globalConfig.min);
    form.setValue("maxGrade", globalConfig.max);
  }, [globalConfig]);

  useEffect(() => {
    if (minGrade > grade) {
      form.setValue("grade", minGrade);
    } else if (maxGrade < grade) {
      form.setValue("grade", maxGrade);
    }
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-4">Перерахунок балу</h1>
        </CardHeader>
        <Separator className="mb-4" />
        <div className="flex items-center space-x-2 mx-6 mb-4 gap-4">
          <div className="flex flex-col gap-2">
            <h3>Пресети Проміжку балів</h3>
            <ToggleGroup
              type="single"
              value={scale}
              onValueChange={(newValue) => {
                setScale((newValue as typeof scale) ?? "0_50");
              }}
            >
              <ToggleGroupItem value="0_25">0-25</ToggleGroupItem>
              <ToggleGroupItem value="0_50">0-50</ToggleGroupItem>
              <ToggleGroupItem value="0_100">0-100</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2">
            <h3>Пресети балів результату</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  form.setValue("minResultGrade", globalConfig.min);
                  form.setValue("maxResultGrade", 10);
                }}
              >
                {globalConfig.min}-10
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  form.setValue("minResultGrade", globalConfig.min);
                  form.setValue("maxResultGrade", 12);
                }}
              >
                {globalConfig.min}-12
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  form.setValue("minResultGrade", 2);
                  form.setValue("maxResultGrade", 10);
                }}
              >
                2-10
              </Button>
            </div>
          </div>
        </div>
        <Separator className="mb-4" />
        <Separator className="mb-4" />
        <CardContent>
          <Form {...form}>
            <form onSubmit={submitHandler} className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Бал з тесту</FormLabel>
                      <p>{field.value}</p>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span>{minGrade}</span>
                          <Slider
                            value={[field.value]}
                            min={minGrade}
                            max={maxGrade}
                            defaultValue={[minGrade]}
                            step={1}
                            onValueChange={([newValue]) => {
                              field.onChange(newValue);
                            }}
                          />
                          <span>{maxGrade}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Кількість балів, яку ви хочете перерахувати
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мінімальний бал в тесті</FormLabel>
                      <p>{field.value}</p>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span>{globalConfig.min}</span>
                          <Slider
                            value={[field.value]}
                            min={globalConfig.min}
                            max={maxGrade}
                            step={1}
                            onValueChange={([newValue]) => {
                              field.onChange(newValue);
                            }}
                          />
                          <span>{maxGrade}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Мінімальна кількість балів, яка передбачена в тесті
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Максимальний бал в тесті</FormLabel>
                      <p>{field.value}</p>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span>{minGrade}</span>
                          <Slider
                            value={[field.value]}
                            min={minGrade}
                            max={globalConfig.max}
                            step={1}
                            onValueChange={([newValue]) => {
                              field.onChange(newValue);
                            }}
                          />
                          <span>{globalConfig.max}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Максимальна кількість балів, яка передбачена в тесті
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minResultGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мінімальний бал в результаті</FormLabel>
                      <p>{field.value}</p>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span>0</span>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={maxResultGrade}
                            step={1}
                            onValueChange={([newValue]) => {
                              field.onChange(newValue);
                            }}
                          />
                          <span>{maxResultGrade}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Мінімальна кількість балів, яка передбачена в результаті
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxResultGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Максимальний бал в результаті</FormLabel>
                      <p>{field.value}</p>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span>{minResultGrade}</span>
                          <Slider
                            value={[field.value]}
                            min={minResultGrade}
                            max={100}
                            step={1}
                            onValueChange={([newValue]) => {
                              field.onChange(newValue);
                            }}
                          />
                          <span>100</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Максимальна кількість балів, яка передбачена в
                        результаті
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Отримати результат</Button>
              {result !== null ? (
                <Card className="w-fit">
                  <CardHeader>
                    <h2 className="text-lg">Результат</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{result}</p>
                  </CardContent>
                </Card>
              ) : null}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
