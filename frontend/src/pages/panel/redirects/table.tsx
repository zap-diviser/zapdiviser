import { useMemo, useState, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Dialog, Stack, Tooltip } from '@mui/material';

// third-party
import { Row } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Add, Eye, Trash } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import AddRedirect from './AddRedirect';
import { useRedirectsControllerFindAll } from 'hooks/api/zapdiviserComponents';
import { SimpleTable } from 'components/SimpleTable';
import DeleteRedirect from './DeleteRedirect';

// ==============================|| REACT TABLE ||============================== //

// ==============================|| CUSTOMER - LIST ||============================== //

export const RedirectsTable = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [deleteIsOpen, setDeleteOpen] = useState<{
    isOpen: boolean;
    data: any;
  }>({
    isOpen: false,
    data: {}
  });

  //   const { handleOpen } = useBuyModal();

  const [redirect, setRedirect] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const { data } = useRedirectsControllerFindAll({});

  //   const { userIsPremium } = useAuth();

  const handleAdd = () => {
    if (redirect && !add) setRedirect(null);
    setAdd(!add);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Nome da Campanha',
        accessor: 'name'
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
      // {
      //   Header: 'Redirecionamentos',
      //   accessor: 'redirects'
      // },
      {
        Header: 'Ações',
        className: 'cell-center',
        disableSortBy: true,
        Cell: (x) => {
          const collapseIcon = x.row.isExpanded ? <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} /> : <Eye />;
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
                    console.log('link clicado = ', x);
                    setRedirect(x.row.original);
                    handleAdd();
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
                    setDeleteOpen({
                      isOpen: true,
                      data: x.row.original.id
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

  console.log('DATAA MUDOUU', deleteIsOpen);

  return (
    <MainCard content={false}>
      <ScrollX>
        <SimpleTable addTitle="Adicionar Redirecionamento" columns={columns} data={data || []} handleAdd={handleAdd} />
      </ScrollX>
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
        <AddRedirect
          redirect={redirect}
          onCancel={handleAdd}
          onSucess={() => {
            handleAdd();
          }}
        />
      </Dialog>

      <DeleteRedirect
        title="Deletar Campanha"
        open={deleteIsOpen.isOpen}
        handleClose={() =>
          setDeleteOpen((prev) => ({
            ...prev,
            isOpen: false
          }))
        }
        id={deleteIsOpen?.data}
      />
    </MainCard>
  );
};
