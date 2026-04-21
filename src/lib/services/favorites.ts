import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useGetFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get("/dashboard/favorites"),
  });
};
