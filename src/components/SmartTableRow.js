import { TableRow, TableRowColumn } from 'material-ui/Table';
import React, { PropTypes } from 'react';
import FormatTableCell from './FormatTableCell';

const SmartTableRow = ({ index, row, tableHeaders }) => (
  <TableRow key={index}>
    {tableHeaders.map((header, propIndex) => (
      <TableRowColumn key={propIndex}>{FormatTableCell(row[header.dataAlias], header.format)}</TableRowColumn>
    ))}
  </TableRow>
);

SmartTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object
};

export default SmartTableRow;