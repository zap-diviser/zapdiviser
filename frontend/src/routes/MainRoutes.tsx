import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { FunnelProvider } from 'contexts/FunnelContext';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const ProductEvents = Loadable(lazy(() => import('pages/panel/products-events/index')));
const Redirects = Loadable(lazy(() => import('pages/panel/redirects/index')));
const Products = Loadable(lazy(() => import('pages/panel/products/index')));
const Chat = Loadable(lazy(() => import('pages/panel/chat/index')));
const Whatsapps = Loadable(lazy(() => import('pages/panel/whatsapps/index')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <FunnelProvider>
            <MainLayout />
          </FunnelProvider>
        </AuthGuard>
      ),
      children: [
        {
          path: 'whatsapp/chat',
          element: <Chat />
        },
        {
          path: 'funil/produtos',
          element: <Products />
        },
        {
          path: 'funil/produtos/:product_id/editar-eventos/:flow_name',
          element: <ProductEvents />
        },
        {
          path: 'funil/whatsapps',
          element: <Whatsapps />
        },
        {
          path: 'redirects',
          element: <Redirects />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
