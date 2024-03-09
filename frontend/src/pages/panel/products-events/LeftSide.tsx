import { Divider, Grid, Typography } from '@mui/material';
import Select from 'react-select';
import { useTheme } from '@mui/material/styles';
import { Whatsapp } from 'iconsax-react';
import MainCard from 'components/MainCard';
import DrawerContent from './DrawerContent';
import {
  useProductControllerFindOne,
  useProductControllerRemoveWhatsappFromProduct,
  useProductControllerSetWhatsapp,
  useWhatsappControllerFindAll
} from 'hooks/api/zapdiviserComponents';
import { useParams } from 'react-router';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { queryKeyFn } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';

export default function LeftSide() {
  const theme = useTheme();

  const { data: whatsapps } = useWhatsappControllerFindAll({});

  const { mutateAsync: addWhatsappToProduct } = useProductControllerSetWhatsapp({
    onSuccess: (data: any) => {
      dispatch(openSnackbar({ message: 'Whatsapp adicionado com sucesso', status: 'success' }));

      const queryKey = queryKeyFn({
        path: '/api/product/{id}',
        operationId: 'productControllerFindOne',
        variables: {
          pathParams: {
            id: product_id as string
          }
        }
      });

      queryClient.cancelQueries({
        queryKey
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return {
          ...old,
          whatsapps: data.whatsapps
        };
      });
    }
  });

  const { mutateAsync: removeWhatsappFromProduct } = useProductControllerRemoveWhatsappFromProduct({
    onSuccess: (data: any) => {
      dispatch(openSnackbar({ message: 'Whatsapp removido com sucesso', status: 'success' }));

      const queryKey = queryKeyFn({
        path: '/api/product/{id}',
        operationId: 'productControllerFindOne',
        variables: {
          pathParams: {
            id: product_id as string
          }
        }
      });

      queryClient.cancelQueries({
        queryKey
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return {
          ...old,
          whatsapps: data.whatsapps
        };
      });
    }
  });

  const { product_id } = useParams<{ product_id: string }>();

  const { data: productInfo } = useProductControllerFindOne({
    pathParams: {
      id: product_id as string
    }
  });

  return (
    <Grid
      item
      xs={12}
      md
      sx={{
        borderRight: '1px solid #ccc'
      }}
    >
      <DrawerContent />

      <Divider
        sx={{
          marginTop: '50px'
        }}
      />
      <MainCard sx={{ bgcolor: 'secondary.lighter', mt: 2, mr: '12px', mb: '30px' }}>
        <Typography variant="button" color={theme.palette.mode === 'dark' ? 'primary' : 'secondary'} display={'flex'} marginBottom={2}>
          <Whatsapp
            style={{
              marginRight: '10px'
            }}
          />
          Whatsapps
        </Typography>

        {productInfo && (
          <Select
            isMulti
            isClearable={false}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: theme.palette.background.paper
              })
            }}
            defaultValue={productInfo?.whatsapps?.map((whatsapp) => ({ label: whatsapp.phone, value: whatsapp.id })) ?? []}
            onChange={(_, event) => {
              if (event.action === 'remove-value') {
                removeWhatsappFromProduct({
                  pathParams: { id: product_id! },
                  body: {
                    whatsappId: event.removedValue.value
                  }
                });
                return;
              }

              if (event.action === 'select-option') {
                addWhatsappToProduct({
                  pathParams: { id: product_id! },
                  body: {
                    whatsappId: event.option?.value
                  }
                });
              }
            }}
            options={
              whatsapps
                ?.filter((whatsapp) => whatsapp.phone || '231414')
                .map((whatsapp) => ({ label: whatsapp.phone, value: whatsapp.id })) ?? []
            }
          ></Select>
        )}
      </MainCard>
    </Grid>
  );
}
