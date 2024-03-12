import { useCallback, useMemo, useState, Fragment, MouseEvent } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Chip, Dialog, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useMediaQuery } from '@mui/material';

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
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';

import AddLink from 'sections/links-collections/all/AddLink';
// import AlertLinkCollectionDelete from 'sections/links-collections/all/AlertLinkCollectionDelete';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { Add, Eye, Trash } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { LinksCollectionType } from 'types/links-collections';
import AlertDeleteLinkCollection from './AlertLinkCollection';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: Array<LinksCollectionType>;
  handleAdd: () => void;
}

function ReactTable({ columns, data, handleAdd }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'title', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="large">
              Adicionar Link
            </Button>
          </Stack>
        </Stack>
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
            {page.map((row: Row, i: number) => {
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
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //

export const LinksTable = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [open, setOpen] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const handleAdd = () => {
    setAdd(!add);

    if (customer && !add) setCustomer(null);
  };

  const handleClose = useCallback(
    async (deleteRow: boolean) => {
      if (deleteRow) {
      }
      setOpen({
        isOpen: false,
        data: {}
      });
    },
    [open]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Título Url',
        accessor: 'title'
      },
      {
        Header: 'Link',
        accessor: 'slug',
        Cell: ({ value }: { value: string }) => (
          <a
            href={'https://webhook.zapdiviser.com/' + value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            zapdiviser.com/webhook/{value}
          </a>
        )
      },
      {
        Header: 'Redirecionamentos',
        accessor: 'redirects'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'inactive':
              return <Chip color="error" label="Inativo" size="small" variant="light" />;
            case 'active':
            default:
              return <Chip color="success" label="Ativo" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Ações',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          const collapseIcon = row.isExpanded ? <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} /> : <Eye />;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Entrar"
              >
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    setAdd(true);
                    console.log(row.original);
                    setCustomer(row.original);
                  }}
                >
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Deletar Link"
              >
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setOpen({
                      isOpen: true,
                      data: row.original
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={[]} handleAdd={handleAdd} />
      </ScrollX>
      {/* <AlertLinkCollectionDelete title={customerDeleteId} open={open} handleClose={handleClose} /> */}
      {/* add customer dialog */}
      {add && (
        <Dialog
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          fullWidth
          onClose={handleAdd}
          open={add}
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <AddLink customer={customer} onCancel={handleAdd} />
        </Dialog>
      )}
      <AlertDeleteLinkCollection title={open.data.title} open={open.isOpen} handleClose={handleClose} />
    </MainCard>
  );
};
