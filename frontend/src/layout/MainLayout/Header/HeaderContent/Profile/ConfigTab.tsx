import { useState, MouseEvent } from 'react';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { Logout, Profile } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

const ConfigTab = ({ handleLogout }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleListItemClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    setSelectedIndex(index);
  };

  const myProfile = useIntl().formatMessage({ id: 'my_profile' });
  const logoutIntl = useIntl().formatMessage({ id: 'logout' });
  const navigate = useNavigate();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          navigate('/my-profile');
          handleListItemClick(event, 0);
        }}
      >
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={myProfile} />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={logoutIntl} />
      </ListItemButton>
    </List>
  );
};

export default ConfigTab;
