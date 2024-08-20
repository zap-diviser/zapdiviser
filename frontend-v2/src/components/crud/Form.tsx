import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../Input";
import { useUserControllerCreate } from "../../hooks/api/zapdiviserComponents";
import Button from "../Button";

const schema = z.object({
  name: z
    .string()
    .min(1, "Este campo é obrigatório")
    .max(255, "Este campo deve ter no máximo 255 caracteres"),
  email: z
    .string()
    .email("Este campo deve ser um email válido")
    .min(1, "Este campo é obrigatório")
    .max(255, "Este campo deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "Este campo deve ter no mínimo 8 caracteres")
    .max(255, "Este campo deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .min(1, "Este campo é obrigatório")
    .max(255, "Este campo deve ter no máximo 255 caracteres"),
});

type FormValues = z.infer<typeof schema>;

const Form: React.FC<{ edit: boolean }> = ({ edit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { mutate, isPending } = useUserControllerCreate({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const onSubmit = ({ email, name, password, phone }: FormValues) => {
    mutate({ body: { email, name, password, phone } });
  };

  return (
    <div
      id="createProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="rdivelative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {edit ? "Editar" : "Adicionar"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="updateProductModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <Input
                label="Name"
                type="text"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Phone"
                type="text"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button type="submit" loading={isPending}>
                {edit ? "Editar" : "Adicionar"}
              </Button>
              <button
                type="button"
                className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                <svg
                  className="mr-1 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Deletar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
