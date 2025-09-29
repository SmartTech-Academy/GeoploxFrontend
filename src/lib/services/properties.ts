
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";

export const useGetProperties = (params: any) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => api.get("/properties", { params }),
  });
};

export const useGetPropertyDetails = (slug: string) => {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: () => api.get(`/properties/${slug}`),
  });
};

export const useGetRelatedProperties = (slug: string) => {
  return useQuery({
    queryKey: ["related-properties", slug],
    queryFn: () => api.get(`/properties/related/${slug}`),
  });
};

export const useGetPropertyCategories = () => {
  return useQuery({
    queryKey: ["property-categories"],
    queryFn: () => api.get("/properties/categories"),
  });
};

export const useGetPropertyTags = () => {
  return useQuery({
    queryKey: ["property-tags"],
    queryFn: () => api.get("/properties/tags"),
  });
};

export const useContactPropertyOwner = () => {
  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) =>
      api.post(`/contact/property-owner/${propertyId}`, data),
  });
};
