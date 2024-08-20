import logo from "../assets/logo.png";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../components/Button";
import Text from "../components/Text";
import { useAuthControllerLogin } from "../hooks/api/zapdiviserComponents";
import { useState } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router";

const schema = z.object({
  email: z.string(),
  password: z.string(),
  stayLogged: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const { setUser, setToken } = useStore();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useAuthControllerLogin({
    onSuccess: (data) => {
      setToken((data as any).access_token);
      setUser({
        email: (data as any).email,
        name: (data as any).name,
      });
      navigate("/");
    },
    onError: (error) => {
      setError((error as any)?.stack?.error?.message || "Ocorreu um erro");
    },
  });

  const onSubmit = ({ email, password }: FormData) => {
    setError(null);
    mutate({ body: { email, password } });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}
        <a
          href="https://zapdiviser.com"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="h-16 mr-2" src={logo} alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Text variant="h4">Login</Text>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                required
                label="E-mail"
                type="email"
                {...register("email")}
              />
              <Input
                required
                label="Senha"
                type="password"
                {...register("password")}
              />
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register("stayLogged")}
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    Mantenha-me logado
                  </label>
                </div>
              </div>
              <Button type="submit" loading={isPending} className="w-full">
                Entrar
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Não tem uma conta?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Cadastre-se
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
