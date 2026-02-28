import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCrops() {
  return useQuery({
    queryKey: [api.crops.list.path],
    queryFn: async () => {
      const res = await fetch(api.crops.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crops");
      const data = await res.json();
      return parseWithLogging<typeof api.crops.list.responses[200]>(
        api.crops.list.responses[200], 
        data, 
        "crops.list"
      );
    },
  });
}
