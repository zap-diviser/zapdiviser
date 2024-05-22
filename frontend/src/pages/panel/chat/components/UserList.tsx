import { Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import { Divider, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { Chance } from 'chance';
import UserAvatar from './UserAvatar';
import Loader from 'components/Loader';
import Dot from 'components/@extended/Dot';
import { TickCircle } from 'iconsax-react';
import { UserProfile } from 'types/user-profile';
import { useChatControllerGetChats } from 'hooks/api/zapdiviserComponents';

const chance = new Chance();

// ==============================|| CHAT - USER LIST ||============================== //

interface UserListProps {
  setUser: (u: UserProfile) => void;
  search?: string;
}

function UserList({ setUser, search }: UserListProps) {
  const theme = useTheme();

  const { data, isLoading: loading } = useChatControllerGetChats({ }, { refetchInterval: 1000 })

  if (loading) return <Loader />;

  return (
    <List component="nav">
      {data?.map((user: any) => (
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
