import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";

export const useGetHomepageProperties = () => {
  return useQuery({
    queryKey: ["homepage-properties"],
    queryFn: () => api.get("/user/homepage/properties"),
  });
};

export const useContactUs = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/user/contact-us", data),
  });
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/user/plans/sections"),
  });
};
