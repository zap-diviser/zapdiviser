import { Grid } from '@mui/material';
import AddEventModal from './AddNewEvent/AddEventModal';
import LeftSide from './LeftSide';
import RightSide from './RightSide';

export default function ProductEvents() {
  return (
    <Grid container>
      <AddEventModal />
      <LeftSide />
      <RightSide />
    </Grid>
  );
}
