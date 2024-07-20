import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const HistoryList = ({ history, onItemClick }) => {
  return (
    <List className="history">
      {history.map((item, index) => (
        <ListItem button key={index} onClick={() => onItemClick(item)}>
          <ListItemText primary={item.fileName} />
        </ListItem>
      ))}
    </List>
  );
};

export default HistoryList;
