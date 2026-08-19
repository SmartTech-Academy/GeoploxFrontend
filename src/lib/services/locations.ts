import { useQuery } from "@tanstack/react-query";
import api from "../api";

export interface LocationNode {
  name: string;
  slug: string;
  type: "state" | "city" | "area" | "neighbourhood";
  children: LocationNode[];
}

/** Corrected state/city/area/neighbourhood tree, replacing the static statesAndLocalGov.json
 *  that used the LGA as the city level and flattened areas/neighbourhoods into one column. */
export const useGetLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => api.get<{ data: LocationNode[] }>("/user/locations"),
    staleTime: 60 * 60 * 1000, // reference data, changes rarely
  });
};
