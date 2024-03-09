import { useEffect, useState } from 'react';

// project-imports
import Routes from 'routes';
import ThemeCustomization from 'themes';
import { QueryClientProvider } from '@tanstack/react-query';

import Loader from 'components/Loader';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import { dispatch } from 'store';
import { fetchMenu } from 'store/reducers/menu';
import { AuthProvider } from 'contexts/AuthContext';
import { queryClient } from 'utils/query-client';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchMenu()).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <Notistack>
                    <Routes />
                    <Snackbar />
                  </Notistack>
                </AuthProvider>
              </QueryClientProvider>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </>
  );
};

export default App;
