import { CircularProgress, Container, Typography } from "@mui/material";
import MuiDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableColumnOptions,
  MUIDataTableOptions,
} from "mui-datatables";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  sex: string;
}

interface Res {
  pageSize: number;
  total: number;
  pageNumber: number;
  totalPage: number;
  count: number;
  data: User[];
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [res, setRes] = useState<Res>({
    pageSize: 100,
    total: 100,
    pageNumber: 1,
    totalPage: 1,
    count: 0,
    data: [],
  });

  useEffect(() => {
    callPaginatedApi();
  }, []);

  const callPaginatedApi = async (page = 0, size = 100) => {
    setIsLoading(true);
    const res = await fetch(
      "http://localhost:5000/users?page=" + page + "&size=" + size
    );
    const json = await res.json();
    if (json)
      setRes((prev) => {
        const { data, ...rest } = json as Res;
        const { data: prevData, ...prevRest } = prev;

        return {
          ...prevRest,
          ...rest,
          data: [...prevData, ...data],
        };
      });
    setIsLoading(false);
  };

  const columnOptions: MUIDataTableColumnOptions = {};
  const tableOptions: MUIDataTableOptions = {
    rowsPerPage: res.pageSize,
    page: res.pageNumber || 0,
    count: res.total || 1,
    onTableChange: (action, state) => {
      console.log(action, state);
      switch (action) {
        case "changePage":
          callPaginatedApi(state.page, state.rowsPerPage);
          break;
        default:
          console.log("Not handled");
          break;
      }
    },
  };

  const columns: MUIDataTableColumnDef[] = [
    {
      name: "firstName",
      label: "First Name",
      options: { ...columnOptions },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: { ...columnOptions },
    },
    {
      name: "email",
      label: "Email",
      options: { ...columnOptions },
    },
    {
      name: "phoneNumber",
      label: "Phone",
      options: { ...columnOptions },
    },
    {
      name: "country",
      label: "Country",
      options: { ...columnOptions },
    },
    {
      name: "sex",
      label: "Sex",
      options: { ...columnOptions },
    },
  ];

  return (
    <Container>
      <MuiDataTable
        title={
          <Typography variant="h6">
            Paginated User list
            {isLoading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: "relative", top: 4 }}
              />
            )}
          </Typography>
        }
        columns={columns}
        data={res.data}
        options={tableOptions}
      />
    </Container>
  );
}

export default App;
