import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Stack, Tooltip } from '@mui/material';

// third-party
import { Row } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

// assets
import { Add, Eye, Trash, Edit } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import AddOrEditProduct from './AddProduct';
import { useNavigate } from 'react-router';
import { SimpleTable } from 'components/SimpleTable';
import { useProductControllerFindAll } from 'hooks/api/zapdiviserComponents';
import DeleteProduct from './DeleteProduct';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const Products = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const { data } = useProductControllerFindAll({});

  const navigate = useNavigate();

  const [open, setOpen] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  const [deleteProduct, setDeleteProduct] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  const handleAdd = () => {
    setOpen((prev) => {
      return {
        isOpen: !prev.isOpen,
        data: null
      };
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Nome do Produto',
        accessor: 'name'
      },
      {
        Header: 'Webhook',
        accessor: 'id',
        Cell: ({ value }: { value: string }) => (
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                  opacity: 0.9
                }
              }
            }}
            title="Copiar Link"
            onClick={() => {
              navigator.clipboard.writeText('https://zapdiviser.com/webhook/' + value);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Link copiado para a área de transferência.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
            }}
          >
            <span
              //   href={'https://zapdiviser.com/webhook/' + value}
              //   target="_blank"
              //   rel="noopener noreferrer"
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              https://zapdiviser.com/webhook/{value}
            </span>
          </Tooltip>
        )
      },
      {
        Header: 'Disparos',
        accessor: 'redirects'
      },
      {
        Header: '',
        accessor: 'primary-actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: any }) => {
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
                title="Editar"
              >
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    setOpen((prev) => {
                      return {
                        isOpen: !prev.isOpen,
                        data: row.original
                      };
                    });
                  }}
                >
                  <Edit />
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
                    setDeleteProduct({ isOpen: true, data: row.original });
                  }}
                >
                  <Trash />
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
                title="Entrar"
              >
                <Button
                  variant="contained"
                  sx={{
                    marginLeft: 1
                  }}
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    navigate(`/funil/produtos/${row.original.id}/editar-eventos/card_approved`);
                  }}
                >
                  Editar Eventos
                </Button>
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
        <SimpleTable columns={columns} data={data || []} handleAdd={handleAdd} addTitle="Adicionar Produto" />
      </ScrollX>

      <AddOrEditProduct product={open.data} isOpen={open.isOpen} onClose={() => setOpen({ isOpen: false, data: null })} />

      <DeleteProduct
        open={deleteProduct.isOpen}
        handleClose={() => {
          setDeleteProduct({ isOpen: false, data: null });
        }}
        title={deleteProduct.data?.name}
        id={deleteProduct.data?.id}
      />
    </MainCard>
  );
};

export default Products;
