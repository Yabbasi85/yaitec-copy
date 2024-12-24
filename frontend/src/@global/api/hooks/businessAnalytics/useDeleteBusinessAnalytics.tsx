import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import api from "../../api.config";
import { queryClient } from "../../queryclient";

export const useDeleteBusinessAnalytics = () => {
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

  const temaSchema = Yup.object({
    id: Yup.string().required(),
  });

  type DeletarSchema = Yup.InferType<typeof temaSchema>;

  async function endPoint(data: DeletarSchema) {
    const result = await api.delete(`/business/${data.id}`);
    return result.data.data;
  }

  const context = useForm({
    resolver: yupResolver(temaSchema),
    reValidateMode: "onChange",
  });

  return { mutate, isLoading, context, status };
};
