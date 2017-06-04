import numeral from 'numeral';
import React from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

export default (cell, format, row) => {
  switch (format && format.type) {
    case 'link':
      return <Link to={ `${format.url}${row.id}` }>{ cell }</Link>;    
    case 'percentage':
      return `${cell}%`;    
    case 'money':
      return numeral(cell).format('0,0');
    default:
      return cell;
  }
};