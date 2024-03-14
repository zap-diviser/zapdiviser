import { useEffect, useMemo, useState, Fragment, MouseEvent, useCallback } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, useMediaQuery } from '@mui/material';

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

import { renderFilterTypes } from 'utils/react-table';

// assets
import { Add, Trash } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { OutlinedInput } from '@mui/material';
import DeleteLink from './DeleteLink';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Array<Column>;
  data: Array<{
    link: string;
  }>;
}

function ReactTable({ columns, data }: Props) {
  const theme = useTheme();

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'title', desc: false };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
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

export const LinksTable = ({
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

  // useEffect(() => {
  //   changeState(data);
  // }, [data]);

  useEffect(() => {
    setData(initialData.filter((x: any) => !x.isDeleted));
  }, [initialData]);

  const [deleteIsOpen, setDeleteIsOpen] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  const columns = [
    {
      Header: 'link',
      accessor: 'link'
    },
    {
      Header: 'Ações',
      className: 'cell-center',
      width: '10%',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => {
        // const props = getFieldProps(`links`);

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
              title="Deletar Link"
            >
              <IconButton
                color="error"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setDeleteIsOpen({
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
  ];

  const [linkUrl, setLinkUrl] = useState<string>('');

  const handleAddLink = useCallback(() => {
    if (!linkUrl) return;
    const newLink = {
      link: linkUrl,
      isGhost: true,
      redirects: 0,
      id: new Date().getTime()
    };
    const newLinks = [...initialData, newLink];
    setData(newLinks);
    changeState(newLinks);
    setLinkUrl('');
  }, [initialData, linkUrl, changeState]);

  const handleDeleteLink = useCallback(() => {
    let newLinks = [];

    if (isEditing) {
      newLinks = initialData.map((item: any) => {
        if (item.id === deleteIsOpen.data.id) {
          return {
            ...item,
            isDeleted: true
          };
        }
        return item;
      });

      if (deleteIsOpen.data.isGhost) {
        newLinks = newLinks.filter((item: any) => item.id !== deleteIsOpen.data.id);
      }
    } else {
      newLinks = initialData.filter((item: any) => item.id !== deleteIsOpen.data.id);
    }

    // setData(newLinks);
    changeState(newLinks);
  }, [initialData, deleteIsOpen?.data?.id, changeState, isEditing]);

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
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
              }}
              placeholder="www.example.com"
              inputProps={{}}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              size="large"
              style={{
                height: '48px'
              }}
              onClick={handleAddLink}
            >
              Adicionar Link
            </Button>
          </Stack>
        </Stack>
        {data.length !== 0 && (
          <ScrollX>
            <ReactTable columns={columns} data={data} />
          </ScrollX>
        )}

        <DeleteLink
          title="Deletar Link"
          open={deleteIsOpen.isOpen}
          handleClose={() => setDeleteIsOpen({ isOpen: false, data: null })}
          handleDelete={handleDeleteLink}
        />
      </Grid>
    </>
  );
};
