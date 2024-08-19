import { createColumnHelper } from "@tanstack/react-table"
import Crud from "../components/crud"
import DefaultLayout from "../layouts/default"

type Person = {
  id: number
  name: string
  age: number
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor("id", {
    cell: info => info.getValue()
  }),
  columnHelper.accessor("name", {
    cell: info => info.getValue()
  }),
  columnHelper.accessor("age", {
    cell: info => info.getValue()
  })
]

const data: Person[] = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Doe", age: 24 },
  { id: 3, name: "John Smith", age: 30 },
  { id: 4, name: "Jane Smith", age: 29 },
  { id: 5, name: "John Johnson", age: 35 },
  { id: 6, name: "Jane Johnson", age: 34 },
  { id: 7, name: "John Brown", age: 40 },
  { id: 8, name: "Jane Brown", age: 39 },
  { id: 9, name: "John White", age: 45 },
  { id: 10, name: "Jane White", age: 44 },
  { id: 11, name: "John Black", age: 50 }
]

const Home: React.FC = () => {
  return (
    <DefaultLayout>
      <Crud data={data} columns={columns as any} />
    </DefaultLayout>
  )
}

export default Home
