
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryClient } from "../queryClient";



export const useGetProfileData = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/dashboard/profile-datas"),
  });
};
