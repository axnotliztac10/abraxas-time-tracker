import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {fetchList} from '../actions/timeEntries'
import {groupByDay} from '../utils/timeEntries'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table'
import Snackbar from 'material-ui/Snackbar'
import SortIcon from 'material-ui/svg-icons/action/swap-vert';

import TimeEntryListItemContainer from './TimeEntryListItemContainer'
import { SmartTableRow } from './SmartTableRow';

function sortFunc(a, b, key) {
  if (typeof(a[key]) === 'number') {
    return a[key] - b[key];
  }

  const ax = [];
  const bx = [];

  a[key].replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']); });
  b[key].replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']); });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
}

export class TimeEntryListItemsByDay extends Component {
  static propTypes = {
    entries: PropTypes.array
  }

  sortByColumn(column, data) {
    const isAsc = this.state.sortHeader === column ? !this.state.isAsc : true;
    const sortedData = data.sort((a, b) => sortFunc(a, b, column));

    if (!isAsc) {
      sortedData.reverse();
    }

    this.setState({
      data: sortedData,
      sortHeader: column,
      isAsc
    });
  }

  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>{this.props.date}</TableHeaderColumn>
            <TableHeaderColumn key='1'>
                <div>
                  Sort by Duration
                  <SortIcon
                    id='duration'
                    onMouseUp={(e) => this.sortByColumn(e.target.id, []) }
                  />
                </div>
              </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            this.props.entries.map((timeEntry) => {
              return (
                <TimeEntryListItemContainer 
                  key={timeEntry.key} 
                  text={timeEntry.text} 
                  id={timeEntry.key} 
                  startTime={timeEntry.startTime} 
                  endTime={timeEntry.endTime}
                  tagId={timeEntry.tagId}
                />
              )
            })
          }
        </TableBody>
      </Table>
    )
  }
}

export class TimeEntryListContainer extends Component {
  static propTypes = {
    onFetchList: PropTypes.func,
    entries: PropTypes.object,
    removedSuccess: PropTypes.bool
  }

  static defaultProps = {
    entries: {},
    removedSuccess: false
  }
 
  componentWillMount() {
    this.props.onFetchList(this.props.uid)
  }

  render() {
    const entriesByDay = groupByDay(this.props.entries)
    return(
      <div>
      {
        entriesByDay.map((e) => (
          <TimeEntryListItemsByDay key={e.date} date={e.date} entries={e.entries} />
        ))      
      }
      <Snackbar
        open={this.props.removedSuccess}
        message="The time entry was deleted"
        autoHideDuration={4000}
      />      
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onFetchList: (uid) => {
      dispatch(fetchList(uid))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    entries: get(state,"timeEntries.entries", {}),
    uid: get(state,"auth.user.uid", null),
    isFetching: get(state, "timeEntries.isFetching", null),
    removedSuccess: get(state, "timeEntries.removedSuccess", false),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeEntryListContainer)