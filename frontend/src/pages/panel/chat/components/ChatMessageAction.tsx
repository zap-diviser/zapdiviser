import { useState, MouseEvent } from 'react';

// material-ui
import { Menu, MenuItem, Typography } from '@mui/material';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Back, Copy, More, Next, Trash } from 'iconsax-react';

// ==============================|| CHAT - ACTION ||============================== //

const ChatMessageAction = ({ index }: { index: number }) => {
  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>(null);

  const handleClickSort = (event: MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        id={`chat-action-button-${index}`}
        aria-controls={open ? `chat-action-menu-${index}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickSort}
        size="small"
        color="secondary"
      >
        <More />
      </IconButton>
      <Menu
        id={`chat-action-menu-${index}`}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseSort}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        MenuListProps={{
          'aria-labelledby': `chat-action-button-${index}`
        }}
        sx={{
          p: 0,
          '& .MuiMenu-list': {
            p: 0
          }
        }}
      >
        <MenuItem>
          <Back style={{ paddingRight: 8 }} />
          <Typography>Reply</Typography>
        </MenuItem>
        <MenuItem>
          <Next style={{ paddingRight: 8 }} />
          <Typography>Forward</Typography>
        </MenuItem>
        <MenuItem>
          <Copy style={{ paddingRight: 8 }} />
          <Typography>Copy</Typography>
        </MenuItem>
        <MenuItem>
          <Trash style={{ paddingRight: 8, paddingLeft: 0 }} />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatMessageAction;
