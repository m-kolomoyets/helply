"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedEffect } from "@react-hookz/web";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const gradeConvertedFormSchema = z.object({
  minGrade: z.number().int().min(0).default(0),
  maxGrade: z.number().int().min(0),
  minResultGrade: z.number().int().min(0).default(0),
  maxResultGrade: z.number().int().min(0),
  grade: z.number().int().min(0),
});

const useGradeConverterForm = (
  initialValues: z.infer<typeof gradeConvertedFormSchema>
) => {
  const form = useForm<z.infer<typeof gradeConvertedFormSchema>>({
    resolver: zodResolver(gradeConvertedFormSchema),
    values: initialValues,
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

  return Number(result.toFixed(2)) || 0;
};

export default function GradeConverter() {
  const [scale, setScale] = useQueryState(
    "scale",
    parseAsStringLiteral(["0_100", "0_50", "0_25"] as const).withDefault("0_25")
  );

  const globalConfig = useMemo(() => {
    const [min, max] = (scale || "0_25").split("_").map(Number);

    return {
      min,
      max,
    };
  }, [scale]);

  const [minGrade, setMinGrade] = useQueryState(
    "min_grade",
    parseAsInteger.withDefault(globalConfig.min)
  );
  const [maxGrade, setMaxGrade] = useQueryState(
    "max_grade",
    parseAsInteger.withDefault(globalConfig.max)
  );
  const [minResultGrade, setMinResultGrade] = useQueryState(
    "min_result_grade",
    parseAsInteger.withDefault(globalConfig.min)
  );
  const [maxResultGrade, setMaxResultGrade] = useQueryState(
    "max_result_grade",
    parseAsInteger.withDefault(globalConfig.max)
  );
  const [grade, setGrade] = useQueryState(
    "grade",
    parseAsInteger.withDefault(globalConfig.min)
  );

  const form = useGradeConverterForm({
    minGrade,
    maxGrade,
    minResultGrade,
    maxResultGrade,
    grade,
  });

  const [result, setResult] = useState(0);

  useEffect(() => {
    setMinGrade(globalConfig.min);
    setMaxGrade(globalConfig.max);
  }, [globalConfig]);

  useEffect(() => {
    if (minGrade > grade) {
      setGrade(minGrade);
    } else if (maxGrade < grade) {
      setGrade(maxGrade);
    }
  });

  useDebouncedEffect(
    () => {
      setResult(
        mapGrade(grade, minGrade, maxGrade, minResultGrade, maxResultGrade)
      );
    },
    [grade, minGrade, maxGrade, minResultGrade, maxResultGrade],
    300
  );

  return (
    <Suspense>
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
                value={scale || "0_25"}
                onValueChange={(newValue) => {
                  setScale((newValue as typeof scale) ?? "0_25");
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
                    setMinResultGrade(globalConfig.min);
                    setMaxResultGrade(10);
                  }}
                >
                  {globalConfig.min}-10
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMinResultGrade(globalConfig.min);
                    setMaxResultGrade(12);
                  }}
                >
                  {globalConfig.min}-12
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMinResultGrade(2);
                    setMaxResultGrade(10);
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
              <form className="space-y-8">
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
                                setGrade(newValue);
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
                <div>
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-lg font-medium">Результат</h2>
                      <p className="text-3xl font-bold">{result}</p>
                    </div>
                  </div>
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
                                setMinGrade(newValue);
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
                                setMaxGrade(newValue);
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
                                setMinResultGrade(newValue);
                              }}
                            />
                            <span>{maxResultGrade}</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Мінімальна кількість балів, яка передбачена в
                          результаті
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
                                setMaxResultGrade(newValue);
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
