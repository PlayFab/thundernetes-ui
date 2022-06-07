import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function Link(
        itemProps,
        ref,
      ) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <li>
      <Tooltip title={primary} placement="right">
        <ListItem button component={renderLink}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={<Typography noWrap>{primary}</Typography>} />
        </ListItem>
      </Tooltip>
    </li>
  );
}

export default ListItemLink;
