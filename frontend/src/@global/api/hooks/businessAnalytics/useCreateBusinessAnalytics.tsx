import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { queryClient } from "../../queryclient";
import api from "../../api.config";

export const useCreateBusinessAnalytics  = () => {
  const {
    mutate,
    isPending: isLoading,
    status,
  } = useMutation({
    mutationFn: endPoint,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["list-competitors"] });
    },
    onError: (erro: AxiosError) => console.log(erro),
  });

  const competitorSchema = Yup.object().shape({
    product: Yup.string().required("Product is required"),
    location: Yup.string().required("Location is required"),
    name: Yup.string().required("Name is required"),
    website: Yup.string()
      .url("Must be a valid URL")
      .required("Website is required"),
    social_media: Yup.string().required("Social media handle is required"),
  });

  const schema = Yup.object().shape({
    competitors: Yup.array().of(competitorSchema),
  });

  type CreateCompetitorsSchemaType = Yup.InferType<typeof schema>;

  async function endPoint(data: CreateCompetitorsSchemaType) {
    const result = await api.post("/business_analysis", data.competitors);
    return result.data.data;
  }

  const context = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  return { mutate, isLoading, context, status };
};
