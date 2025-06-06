
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import RestoreIcon from '@mui/icons-material/Restore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      cursor: 'pointer',
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const BreadcrumbsContainer = () => {
  const navigate = useNavigate();
  const HomeIconHandle = (n) => {
    localStorage.setItem('cancel', 'cancel');
    switch (n) {
      case 1:
        navigate(`/dashboard/default`);
        break;
      case 2:
        navigate(`/MyList`);
        break;
      default:
        navigate(`/MyList`);
        break;
    }
  };
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Home"
          icon={<HomeIcon fontSize="small" />}
          onClick={() => HomeIconHandle(1)}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="My List"
          icon={<RestoreIcon fontSize="small" />}
          onClick={() => HomeIconHandle(2)}
        />
      </Breadcrumbs><br />
    </div>
  )
};

export default BreadcrumbsContainer;


