import { CSSProperties, ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { ArrowRight2, Buildings2, Home3 } from 'iconsax-react';

// types
import { OverrideIcon } from 'types/root';
import { NavItemType } from 'types/menu';

// ==============================|| BREADCRUMBS ||============================== //

export interface BreadCrumbSxProps extends CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface Props {
  card?: boolean;
  divider?: boolean;
  icon?: boolean;
  icons?: boolean;
  maxItems?: number;
  navigation?: { items: NavItemType[] };
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

const Breadcrumbs = ({
  card,
  divider = true,
  icon,
  icons,
  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  titleBottom,
  sx,
  ...others
}: Props) => {
  const theme = useTheme();
  const location = useLocation();
  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();

  const iconSX = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  useLayoutEffect(() => {
    navigation?.items?.map((menu: NavItemType, index: number) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu as { children: NavItemType[]; type?: string });
      }
      return false;
    });
  });

  let customLocation = location.pathname;

  useEffect(() => {
    setItem(undefined);
  }, [customLocation]);

  // set active item state
  const getCollapse = (menu: NavItemType) => {
    if (menu.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse as { children: NavItemType[]; type?: string });
          if (collapse.url === customLocation) {
            setMain(collapse);
            setItem(collapse);
          }
        } else if (collapse.type && collapse.type === 'item') {
          if (customLocation === collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }

        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator!;
  const separatorIcon = separator ? <SeparatorIcon size={12} /> : <ArrowRight2 size={12} />;

  let mainContent;
  let itemContent;
  let breadcrumbContent: ReactElement = <Typography />;
  let itemTitle: NavItemType['title'] = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse' && main.breadcrumbs === true) {
    CollapseIcon = main.icon ? main.icon : Buildings2;
    mainContent = (
      <Typography
        component={Link}
        to={document.location.pathname}
        variant="h6"
        sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        color="secondary"
      >
        {icons && <CollapseIcon style={iconSX} />}
        {main.title}
      </Typography>
    );
    breadcrumbContent = (
      <MainCard
        border={card}
        sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
        {...others}
        content={card}
        boxShadow={false}
      >
        <Grid
          container
          direction={rightAlign ? 'row' : 'column'}
          justifyContent={rightAlign ? 'space-between' : 'flex-start'}
          alignItems={rightAlign ? 'center' : 'flex-start'}
          spacing={0.5}
        >
          <Grid item>
            <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
              <Typography
                component={Link}
                to="/"
                variant="h6"
                sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                color="textPrimary"
              >
                {icons && <Home3 style={iconSX} />}
                {icon && !icons && <Home3 variant="Bold" style={{ ...iconSX, marginRight: 0 }} />}
                {(!icon || icons) && 'Home'}
              </Typography>
              {mainContent}
            </MuiBreadcrumbs>
          </Grid>
          {title && titleBottom && (
            <Grid item sx={{ mt: card === false ? 0 : 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {main.title}
              </Typography>
            </Grid>
          )}
        </Grid>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </MainCard>
    );
  }

  // items
  if (item && item.type === 'item') {
    itemTitle = item.title;

    ItemIcon = item.icon ? item.icon : Buildings2;
    itemContent = (
      <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
        {icons && <ItemIcon style={iconSX} />}
        {itemTitle}
      </Typography>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
          {...others}
          content={card}
          boxShadow={false}
        >
          <Grid
            container
            direction={rightAlign ? 'row' : 'column'}
            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
            alignItems={rightAlign ? 'center' : 'flex-start'}
            spacing={0.5}
          >
            {title && !titleBottom && (
              <Grid item>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
              </Grid>
            )}
            {/* <Grid item>
              <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
                <Typography
                  component={Link}
                  to="/"
                  color="textPrimary"
                  variant="h6"
                  sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  {icons && <Home3 style={iconSX} />}
                  {icon && !icons && <Home3 variant="Bold" style={{ ...iconSX, marginRight: 0 }} />}
                  {(!icon || icons) && 'Home'}
                </Typography>
                {mainContent}
                {itemContent}
              </MuiBreadcrumbs>
            </Grid> */}
            {title && titleBottom && (
              <Grid item sx={{ mt: card === false ? 0 : 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
              </Grid>
            )}
          </Grid>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
