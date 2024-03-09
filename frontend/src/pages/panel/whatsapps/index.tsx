import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Chip, Stack, Tooltip } from '@mui/material';

// third-party
import { Row } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

// assets
import { Trash } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import QRWhatsapp from './QRWhatsapp';
import { SimpleTable } from 'components/SimpleTable';
import { useWhatsappControllerFindAll } from 'hooks/api/zapdiviserComponents';
import DeleteWhatsapp from './DeleteWhatsapp';

const Whatsapp = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const { data } = useWhatsappControllerFindAll({});

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
        Header: 'Número',
        accessor: 'phone',
        Cell: ({ value }: { value: string }) => {
          return value || 'Sem número cadastrado';
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: number }) => {
          switch (value) {
            case 1:
              return <Chip color="success" label="Conectado" size="small" variant="light" />;
            case 2:
              return <Chip color="warning" label="Aguardando QRCode" size="small" variant="light" />;
            default:
              return <Chip color="success" label="Ativo" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Ações',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {row.original.status === 2 && (
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                        opacity: 0.9
                      }
                    }
                  }}
                  title="Ler QRCode"
                >
                  <Button
                    color="warning"
                    variant="outlined"
                    sx={{
                      marginRight: '15px'
                    }}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setOpen({ isOpen: true, data: row.original });
                    }}
                  >
                    Ler QRCode
                  </Button>
                </Tooltip>
              )}
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Deletar Whatsapp"
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
        <SimpleTable columns={columns} data={data || []} handleAdd={handleAdd} addTitle="Adicionar Whatsapp" />
      </ScrollX>

      {open.isOpen && <QRWhatsapp isOpen={open.isOpen} onClose={() => setOpen({ isOpen: false, data: null })} data={open.data} />}

      <DeleteWhatsapp
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

export default Whatsapp;
