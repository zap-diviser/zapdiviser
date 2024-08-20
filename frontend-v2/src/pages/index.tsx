import { createColumnHelper } from "@tanstack/react-table";
import Crud from "../components/crud";
import DefaultLayout from "../layouts/default";
import { useUserControllerFindAll } from "../hooks/api/zapdiviserComponents";

type Person = {
  email: number;
  name: string;
  phone: number;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => "Nome",
  }),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: () => "Telefone",
  }),
];

const Home: React.FC = () => {
  const { data, isLoading } = useUserControllerFindAll({});

  if (isLoading) {
    return <DefaultLayout>Loading...</DefaultLayout>;
  }

  return (
    <DefaultLayout>
      <Crud data={data as any} columns={columns as any} />
    </DefaultLayout>
  );
};

export default Home;
