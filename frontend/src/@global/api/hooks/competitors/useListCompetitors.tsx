import { useQuery } from "@tanstack/react-query";
import { CompetitorsResponse } from "../../../@types/ApiResponses";
import api from "../../api.config";

export const useListCompetitors = () => {
  const { data } = useQuery({
    queryKey: ["list-competitors"],
    queryFn: async () => await endPoint(),
  });

  return { data };
};

async function endPoint(): Promise<CompetitorsResponse[]> {
  const { data } = await api.get("/competitors");
  return data;
}