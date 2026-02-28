import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calculator as CalcIcon, Sprout, Info, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useCrops } from "@/hooks/use-crops";
import { useCreateCalculation } from "@/hooks/use-calculations";
import { CreateCalculationInput, CreateCalculationResponse } from "@shared/routes";

const formSchema = z.object({
  cropId: z.coerce.number({ required_error: "Please select a crop." }),
  fieldSize: z.coerce.number().min(0.1, "Field size must be at least 0.1 acres"),
});

export default function Calculator() {
  const { data: crops, isLoading: isLoadingCrops } = useCrops();
  const { mutate: calculate, isPending: isCalculating } = useCreateCalculation();
  const [result, setResult] = useState<CreateCalculationResponse | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldSize: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    calculate(values, {
      onSuccess: (data) => setResult(data),
    });
  }

  const selectedCropId = form.watch("cropId");
  const selectedCrop = crops?.find(c => c.id === selectedCropId);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Fertilizer Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your crop and field details below to generate a tailored organic fertilizer plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-xl shadow-black/5 bg-white rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="pt-8 pb-6">
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                <CalcIcon className="w-6 h-6 text-primary" />
                Field Details
              </CardTitle>
              <CardDescription className="text-base">
                Select what you're planting to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="cropId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Crop Type</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(Number(val))} 
                          defaultValue={field.value?.toString()}
                          disabled={isLoadingCrops}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-2 focus:ring-primary/20 text-base">
                              <SelectValue placeholder={isLoadingCrops ? "Loading crops..." : "Select a crop..."} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {crops?.map((crop) => (
                              <SelectItem key={crop.id} value={crop.id.toString()} className="text-base py-3">
                                {crop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedCrop && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-start gap-3"
                    >
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        <span className="font-medium text-primary block mb-1">{selectedCrop.name}</span>
                        {selectedCrop.description}
                      </p>
                    </motion.div>
                  )}

                  <FormField
                    control={form.control}
                    name="fieldSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Field Size (Acres)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              step="0.1" 
                              {...field} 
                              className="h-12 rounded-xl border-2 focus:ring-primary/20 text-base pl-4 pr-16"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                              acres
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all mt-4"
                    disabled={isCalculating || isLoadingCrops}
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Generate Plan <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <Card className="border-none shadow-xl shadow-black/5 bg-primary rounded-3xl overflow-hidden text-primary-foreground h-full relative">
                  {/* Decorative background shapes for result card */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                  
                  <CardHeader className="pt-8 pb-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 w-fit border border-white/20 mb-4">
                      <Sprout className="w-4 h-4" />
                      <span className="text-sm font-medium">Success! Plan Generated</span>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-display text-white">
                      Your Recommendation
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-lg">
                      Based on {result.fieldSize} acres of {result.crop.name}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      
                      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-black/30 transition-colors">
                        <div className="text-primary-foreground/70 font-medium mb-2 text-sm uppercase tracking-wider">Required Compost</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-display font-bold">{Number(result.resultCompost).toLocaleString()}</span>
                          <span className="text-xl font-medium opacity-80">kg</span>
                        </div>
                        <p className="text-sm opacity-70 mt-3 pt-3 border-t border-white/10">
                          Apply evenly across the field before planting.
                        </p>
                      </div>

                      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-black/30 transition-colors">
                        <div className="text-primary-foreground/70 font-medium mb-2 text-sm uppercase tracking-wider">Required Manure</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-display font-bold">{Number(result.resultManure).toLocaleString()}</span>
                          <span className="text-xl font-medium opacity-80">kg</span>
                        </div>
                        <p className="text-sm opacity-70 mt-3 pt-3 border-t border-white/10">
                          Well-rotted organic farmyard manure.
                        </p>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center min-h-[400px]"
              >
                <div className="text-center max-w-sm px-6">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sprout className="w-12 h-12 text-primary/40" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">Awaiting Details</h3>
                  <p className="text-muted-foreground">
                    Fill out the form on the left to see your sustainable fertilizer requirements appear here.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
