import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, useMediaQuery } from '@mui/material';

// project-imports
import Dot from 'components/@extended/Dot';
import { useConfig } from 'contexts/ConfigContext';
import { dispatch, useSelector } from 'store';
import { activeItem, openDrawer } from 'store/reducers/menu';

// types
import { MenuOrientation, ThemeMode } from 'types/config';
import { LinkTarget, NavItemType } from 'types/menu';

// ==============================|| NAVIGATION - ITEM ||============================== //

interface Props {
  item: NavItemType;
  level: number;
}

const NavItem = ({ item, level }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const { menuOrientation } = useConfig();

  let itemTarget: LinkTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const isSelected = openItem.findIndex((id: string) => id === item.id) > -1;

  const Icon = item.icon!;
  const itemIcon = item.icon ? <Icon variant="Bulk" size={drawerOpen ? 20 : 22} /> : false;

  const { pathname } = useLocation();

  // active menu item on page load
  useEffect(() => {
    if (pathname && pathname.includes('product-details')) {
      if (item.url && item.url.includes('product-details')) {
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }

    if (pathname && pathname.includes('kanban')) {
      if (item.url && item.url.includes('kanban')) {
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }

    if (pathname === item.url) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'secondary.400' : 'secondary.main';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <ListItemButton
          component={Link}
          to={item.url!}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 20}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                bgcolor: 'transparent'
              }
            }),
            ...(drawerOpen &&
              level === 1 && {
                mx: 1.25,
                my: 0.5,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'secondary.200'
                },
                '&.Mui-selected': {
                  color: iconSelectedColor,
                  '&:hover': {
                    color: iconSelectedColor
                  }
                }
              }),
            ...(!drawerOpen && {
              px: 2.75,
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                bgcolor: 'transparent'
              }
            })
          }}
          {...(downLG && {
            onClick: () => dispatch(openDrawer(false))
          })}
        >
          {itemIcon && (
            <Tooltip title={item.title} placement="right-end">
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: isSelected ? iconSelectedColor : textColor,
                  ...(!drawerOpen &&
                    level === 1 && {
                      borderRadius: 1,
                      width: 46,
                      height: 46,
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.200'
                      }
                    }),
                  ...(!drawerOpen &&
                    isSelected && {
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.100' : 'primary.lighter',
                      '&:hover': {
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'primary.lighter'
                      }
                    })
                }}
              >
                {itemIcon}
              </ListItemIcon>
            </Tooltip>
          )}

          {!itemIcon && drawerOpen && (
            <ListItemIcon
              sx={{
                minWidth: 30
              }}
            >
              <Dot size={isSelected ? 6 : 5} color={isSelected ? 'primary' : 'secondary'} />
            </ListItemIcon>
          )}

          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontWeight: isSelected ? 500 : 400 }}>
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          component={Link}
          to={item.url!}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            ...(drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                bgcolor: 'transparent',
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: 'transparent'
                }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                bgcolor: 'transparent'
              }
            })
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 36,
                ...(!drawerOpen && {
                  borderRadius: 1,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: 'transparent'
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'transparent'
                    }
                  })
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontWeight: isSelected ? 500 : 400 }}>
                {item.title}
              </Typography>
            }
          />
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
              sx={{ ml: 1 }}
            />
          )}
        </ListItemButton>
      )}
    </>
  );
};

export default NavItem;
