import { useQuery } from "@tanstack/react-query";
import api from "../../api.config";
import { ContentApiResponse } from "../../../@types/ApiResponses";

type QueryParams = {
  single: boolean;
  type: string;
};

export const useGetSingleContent = (params: QueryParams) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-content", JSON.stringify(params)],
    queryFn: async () => await endPoint(params),
  });

  return { data, isLoading };
};

async function endPoint(params: QueryParams): Promise<ContentApiResponse> {
  const { data } = await api.get("/content", {
    params,
  });
  return data;
}
