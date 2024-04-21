import { Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';

// third-party
import { Chance } from 'chance';

// project-imports
import UserAvatar from './UserAvatar';
import Loader from 'components/Loader';
import Dot from 'components/@extended/Dot';

import { dispatch, useSelector } from 'store';
import { getUsers } from 'store/reducers/chat';

// assets
import { TickCircle } from 'iconsax-react';

// types
import { KeyedObject } from 'types/root';
import { UserProfile } from 'types/user-profile';

const chance = new Chance();

// ==============================|| CHAT - USER LIST ||============================== //

interface UserListProps {
  setUser: (u: UserProfile) => void;
  search?: string;
}

function UserList({ setUser, search }: UserListProps) {
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserProfile[]>([]);

  const { users } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    if (search) {
      const results = users.filter((row: KeyedObject) => {
        let matches = true;

        const properties: string[] = ['name'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (row[property].toString().toLowerCase().includes(search.toString().toLowerCase())) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
        return matches;
      });

      setData(results);
    } else {
      setData(users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (loading) return <Loader />;

  return (
    <List component="nav">
      {data.map((user) => (
        <Fragment key={user.id}>
          <ListItemButton
            sx={{ pl: 1 }}
            onClick={() => {
              setUser(user);
            }}
          >
            <ListItemAvatar>
              <UserAvatar user={user} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user.lastMessage}
                  </Typography>
                </Stack>
              }
              secondary={
                <Typography
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <>{user.status}</>
                  <>
                    {user.unReadChatCount ? (
                      <Dot />
                    ) : (
                      // chance.bool() - use for last send msg was read or unread
                      <TickCircle size={16} style={{ color: chance.bool() ? theme.palette.secondary[400] : theme.palette.primary.main }} />
                    )}
                  </>
                </Typography>
              }
            />
          </ListItemButton>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

export default UserList;
