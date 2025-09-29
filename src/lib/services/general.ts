
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";

export const useGetHomepageProperties = () => {
  return useQuery({
    queryKey: ["homepage-properties"],
    queryFn: () => api.get("/homepage/properties"),
  });
};

export const useContactUs = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/contact-us", data),
  });
};
