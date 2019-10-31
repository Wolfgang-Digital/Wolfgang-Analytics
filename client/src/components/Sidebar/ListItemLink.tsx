import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  to: string
  primary: string
  icon: any
}

const useStyles = makeStyles({
  root: {
    paddingLeft: 24
  }
});

const ListItemLink: React.FC<Props> = ({ icon, primary, to }) => {
  const renderLink = React.useMemo(() => React.forwardRef((linkProps, ref) => <Link to={to} {...linkProps} ref={ref as any} />), [to]);
  const classes = useStyles({});

  return (
    // @ts-ignore
    <ListItem button component={renderLink} className={classes.root}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  );
};

export default ListItemLink;
