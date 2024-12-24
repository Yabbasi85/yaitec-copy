import { useQuery } from "@tanstack/react-query";
import { BusinessResponse } from "../../../@types/ApiResponses";
import api from "../../api.config";

export const useListBusinessAnalytics = () => {
  const { data } = useQuery({
    queryKey: ["list-competitors"],
    refetchInterval: 5000, 
    queryFn: async () => await endPoint(),
  });

  return { data };
};

async function endPoint(): Promise<BusinessResponse[]> {
  const { data } = await api.get("/business");
  return data;
}
