import { queryOptions } from "@tanstack/react-query";
import { getSystemData } from "./system.functions";

export const systemQueryOptions = queryOptions({
  queryKey: ["system-data"],
  queryFn: () => getSystemData(),
});
