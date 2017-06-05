import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {fetchList} from '../actions/timeEntries'
import {groupByDay} from '../utils/timeEntries'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table'
import Snackbar from 'material-ui/Snackbar'
import SortIcon from 'material-ui/svg-icons/action/swap-vert'

import {getTimeDuration} from '../utils/time'

import TimeEntryListItemContainer from './TimeEntryListItemContainer'

function sortFunc(a, b) {
  var durationA = getTimeDuration(a.startTime, a.endTime, true);
  var durationB = getTimeDuration(b.startTime, b.endTime, true)
  return durationA - durationB;
}

export class TimeEntryListItemsByDay extends Component {
  static propTypes = {
    entries: PropTypes.array
  }

  static isAsc = false;

  sortByColumn(data, isAsc) {
    const sortedData = data.sort((a, b) => sortFunc(a, b));

    if (!isAsc) {
      sortedData.reverse();
    }

    this.isAsc = !isAsc;
    this.forceUpdate()
  }

  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>{this.props.date}</TableHeaderColumn>
            <TableHeaderColumn>
                <div>
                  Duration
                  <SortIcon
                    onMouseUp={(e) => this.sortByColumn(this.props.entries, this.isAsc) }
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