import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { queryClient } from "../../queryclient";
import api from "../../api.config";

export const useCreateContent = () => {
  const {
    mutate,
    isPending: isLoading,
    status,
  } = useMutation({
    mutationFn: endPoint,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["list-competitors"] });
      queryClient.resetQueries({ queryKey: ["get-content"] });
    },
    onError: (erro: AxiosError) => console.log(erro),
  });

  const schema = Yup.object().shape({
    competitors_ids: Yup.array(
      Yup.string().required("A competitor ID must be a string."),
    ).required("Please select at least one competitor."),
    platforms: Yup.array(
      Yup.string().required("Each platform must be a string."),
    ).required("Please choose at least one social media platform."),
    campaign_duration: Yup.number()
      .required("Campaign duration is required.")
      .integer("Please enter a whole number for the campaign duration.")
      .typeError("Campaign duration must be a number."),
    posts_per_month: Yup.number()
      .required("Posts per month are required.")
      .integer("Please enter a whole number for the number of posts per month.")
      .typeError("Posts per month must be a number."),
    goals: Yup.array(Yup.string().required("A goal must be a string."))
      .required("Goals are required. Please specify your campaign objectives.")
      .typeError("Goals must be a valid text."),
    selectedCompetitors: Yup.array(),
    newGoal: Yup.string().notRequired(),
  });

  type CreateContentSchemaType = Yup.InferType<typeof schema>;

  async function endPoint(data: CreateContentSchemaType) {
    const result = await api.post("/content_creator", data);
    return result.data.data;
  }

  const context = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: {
      selectedCompetitors: [],
      platforms: [],
      goals: [],
    },
  });

  return { mutate, isLoading, context, status };
};
