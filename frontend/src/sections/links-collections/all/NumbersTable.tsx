import { useEffect, useMemo, useState, Fragment, MouseEvent, useCallback } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  FormControlLabel,
  Switch
} from '@mui/material';

// third-party
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell
} from 'react-table';

// project-imports
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { HeaderSort } from 'components/third-party/ReactTable';

import DetailedLinksCollectionDelete from 'sections/links-collections/all/DetailedLinksCollectionDelete';

import { renderFilterTypes } from 'utils/react-table';

// assets
import { Add, Trash } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { OutlinedInput } from '@mui/material';
import { maskValue } from 'utils/mask';
import { useBuyModal } from 'contexts/BuyModalContext';
import { useAuth } from 'contexts/AuthContext';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Array<Column>;
  data: Array<{
    whatsapp: string;
    redirects: number;
  }>;
}

function ReactTable({ columns, data }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'title', desc: false };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, setHiddenColumns, rows } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <Stack spacing={3}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup) => (
                  <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row: Row, i: number) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: Cell) => (
                      <TableCell
                        {...cell.getCellProps([{ className: cell.column.className }])}
                        style={{
                          width: cell.column.width ? cell.column.width : 'auto'
                        }}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //

export const NumbersTable = ({
  initialData,
  changeState,
  getFieldProps,
  isEditing
}: {
  initialData: any;
  changeState: any;
  getFieldProps: any;
  isEditing: boolean;
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [data, setData] = useState<any>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [open, setOpen] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  const handleClose = useCallback(
    (deleteRow: boolean) => {
      if (deleteRow) {
        setData(data.filter((item: any) => item.whatsapp !== open.data.whatsapp));
        changeState(data.filter((item: any) => item.whatsapp !== open.data.whatsapp));
      }

      setOpen({
        isOpen: false,
        data: {}
      });
    },
    [data, open]
  );

  const columns = [
    {
      Header: 'Whatsapp',
      accessor: 'whatsapp'
    },
    {
      Header: 'Redirecionamentos',
      accessor: 'redirects'
    },
    {
      Header: 'Ações',
      className: 'cell-center',
      width: '10%',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => {
        const props = getFieldProps(`numbers`);

        return (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
            {(() => {
              if (!isEditing) return null;
              const is_active = props.value?.[row.id]?.is_active;
              return (
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={is_active}
                      onChange={(e: any) => {
                        const data = getFieldProps(`numbers`).value;
                        changeState(
                          data.map((item: any) => {
                            if (item.whatsapp === (row.original as any).whatsapp) {
                              item.is_active = e.target.checked;
                            }
                            return item;
                          })
                        );
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    />
                  }
                  label=""
                  labelPlacement="start"
                />
              );
            })()}
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                    opacity: 0.9
                  }
                }
              }}
              title="Deletar Número"
            >
              <IconButton
                color="error"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setOpen({
                    isOpen: true,
                    data: {
                      whatsapp: (row.original as any).whatsapp
                    }
                  });
                }}
              >
                <Trash />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  const [number, setNumber] = useState<string>('');

  const { handleOpen } = useBuyModal();

  const { userIsPremium } = useAuth();

  const handleAddNumber = useCallback(() => {
    if (!number) return;
    if (data.length >= 3 && !userIsPremium) {
      handleOpen();
      return;
    }
    setData([
      ...data,
      {
        whatsapp: number,
        is_active: true,
        redirects: 0
      }
    ]);
    setNumber('');
    changeState([
      ...data,
      {
        whatsapp: number,
        redirects: 0
      }
    ]);
  }, [data, number, changeState]);

  return (
    <>
      <Grid item sx={{ mt: 5, mb: 0 }}>
        <Stack direction={'row'} justifyContent="space-between" alignItems="center" sx={{ pb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              width: '100%'
            }}
          >
            <OutlinedInput
              style={{
                width: '60%',
                marginRight: '15px'
              }}
              value={number}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                const mask = onlyNums.length <= 10 ? '(##) ####-####' : '(##) # ####-####';
                setNumber(maskValue(onlyNums, mask));
              }}
              placeholder="(99) 99999-9999"
              inputProps={{}}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              size="large"
              style={{
                height: '48px'
              }}
              onClick={handleAddNumber}
            >
              Adicionar Whatsapp
            </Button>
          </Stack>
        </Stack>
        {data.length !== 0 && (
          <ScrollX>
            <ReactTable columns={columns} data={data} />
          </ScrollX>
        )}

        <DetailedLinksCollectionDelete title={open.data.whatsapp} open={open.isOpen} handleClose={handleClose} />
      </Grid>
    </>
  );
};
