// material-ui
import { Box, Grid, Rating, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import Avatar from 'components/@extended/Avatar';

// third-party
import Slider from 'react-slick';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import Avatar2 from 'assets/images/users/avatar-2.png';
import Avatar3 from 'assets/images/users/avatar-3.png';
import Avatar4 from 'assets/images/users/avatar-4.png';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const usercomment = [
    {
      image: Avatar1,
      name: 'Allie Grater',
      designation: '@alliegrater',
      rating: 4,
      comment:
        'Very good customer service!👌 I liked the design and there was nothing wrong, but found out after testing that it did not quite match the functionality and overall design that I needed for my type of software. I therefore contacted customer service and it was no problem even though the deadline for refund had actually expired.😍'
    },
    {
      image: Avatar2,
      name: 'Allie Grater',
      designation: '@alliegrater',
      rating: 3,
      comment:
        'Very good customer service!👌 I liked the design and there was nothing wrong, but found out after testing that it did not quite match the functionality and overall design that I needed for my type of software. I therefore contacted customer service and it was no problem even though the deadline for refund had actually expired.😍'
    },
    {
      image: Avatar3,
      name: 'Allie Grater',
      designation: '@alliegrater',
      rating: 5,
      comment:
        'Very good customer service!👌 I liked the design and there was nothing wrong, but found out after testing that it did not quite match the functionality and overall design that I needed for my type of software. I therefore contacted customer service and it was no problem even though the deadline for refund had actually expired.😍'
    },
    {
      image: Avatar4,
      name: 'Allie Grater',
      designation: '@alliegrater',
      rating: 4,
      comment:
        'Very good customer service!👌 I liked the design and there was nothing wrong, but found out after testing that it did not quite match the functionality and overall design that I needed for my type of software. I therefore contacted customer service and it was no problem even though the deadline for refund had actually expired.😍'
    }
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        '&:before': {
          content: `" "`,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'linear-gradient(338deg, rgba(0, 0, 0, 0.3), transparent)'
        }
      }}
    >
      <Box
        sx={{
          width: 500,
          m: '0 auto',
          color: theme.palette.common.white,
          '& .slick-dots': {
            bottom: '-45px',
            '& li': {
              width: 'auto',
              margin: 0,
              '& button': {
                width: 'auto',
                '&:before': {
                  position: 'relative',
                  display: 'inline-block',
                  content: '""',
                  width: 6,
                  height: 6,
                  borderRadius: 1,
                  bgcolor: theme.palette.common.white
                }
              },
              '&.slick-active button:before': {
                width: 30
              }
            }
          }
        }}
      >
        <Slider {...settings}>
          {usercomment.map((item, index) => (
            <Box key={index} sx={{ width: '100%', textAlign: 'center' }}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Avatar alt="User 1" src={item.image} variant="circular" size="lg" sx={{ m: '0 auto' }} />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{item.name}</Typography>
                  <Typography variant="body2">{item.designation}</Typography>
                </Grid>
                <Grid item>
                  <Rating name="disabled" value={item.rating} readOnly />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{item.comment}</Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default AuthBackground;
