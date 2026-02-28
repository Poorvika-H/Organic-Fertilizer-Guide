import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateCalculationInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCalculations() {
  return useQuery({
    queryKey: [api.calculations.list.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch calculations history");
      const data = await res.json();
      return parseWithLogging<typeof api.calculations.list.responses[200]>(
        api.calculations.list.responses[200], 
        data, 
        "calculations.list"
      );
    },
  });
}

export function useCreateCalculation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateCalculationInput) => {
      const validated = api.calculations.create.input.parse(input);
      const res = await fetch(api.calculations.create.path, {
        method: api.calculations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Failed to create calculation");
      }

      const data = await res.json();
      return parseWithLogging<typeof api.calculations.create.responses[201]>(
        api.calculations.create.responses[201],
        data,
        "calculations.create"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculations.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
