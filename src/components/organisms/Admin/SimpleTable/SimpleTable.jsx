import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import cls from 'classnames';

import _isEqual from 'lodash/isEqual';

import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from './SimpleTable.module.scss';

export const ACTIONS_COLUMN_ID = 'actions';
export const PER_PAGE_VARIANTS = [5, 10, 30];

function SimpleTable(props) {
  const {
    paginateOnServer,
    location,
    history,
    hidePagination,
    headers,
    list,
    meta,
    statuses,
    onEdit,
    onDelete,
  } = props;
  const { page: queryPage, per_page: queryPerPage } = location.query;

  let initialPage;
  switch (true) {
    case paginateOnServer && meta.page !== undefined: {
      initialPage = meta.page - 1;
      break;
    }
    case queryPage !== undefined: {
      initialPage = +queryPage - 1;
      break;
    }
    default: {
      initialPage = 0;
      break;
    }
  }
  const [page, setPage] = useState(initialPage);

  let initialPerPage;
  switch (true) {
    case queryPage !== undefined && PER_PAGE_VARIANTS.includes(+queryPerPage): {
      initialPerPage = +queryPerPage;
      break;
    }
    case paginateOnServer && meta.perPage !== undefined: {
      initialPerPage = meta.perPage;
      if (!PER_PAGE_VARIANTS.includes(meta.perPage)) {
        PER_PAGE_VARIANTS.push(meta.perPage);
      }
      break;
    }
    default: {
      initialPerPage = 10;
      break;
    }
  }
  const [rowsPerPage, setRowsPerPage] = useState(initialPerPage);

  useEffect(() => {
    const query = {
      ...location.query,
      page: (page + 1).toString(),
      per_page: rowsPerPage.toString(),
    };
    if (!_isEqual(query, location.query)) {
      history.push(`${location.pathname}?${qs.stringify(query)}`);
    }
  }, [history, location.pathname, location.query, page, rowsPerPage]);

  useEffect(() => {
    if (!paginateOnServer && statuses.success && page * rowsPerPage >= list.length) {
      setPage(0);
    }
  }, [list.length, page, paginateOnServer, rowsPerPage, statuses.success]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleEditItem = id => () => onEdit(id);

  const handleDeleteItem = id => () => onDelete(id);

  const getItemsOnPageInfo = ({ from, to, count }) => {
    return ''
      .concat(from, '-')
      .concat(to === -1 ? count : to, ' из ')
      .concat(count);
  };

  const renderTableHeader = () => (
    <TableHead className={styles.tableHead}>
      <TableRow>
        {headers.map(item => (
          <TableCell key={item.id} className={styles.headItem}>
            {item.text}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableItem = item => (
    <>
      {headers.map(column => {
        if (column.id === ACTIONS_COLUMN_ID) {
          return (
            <TableCell key={ACTIONS_COLUMN_ID} className={styles.actionsColumn}>
              {onEdit && (
                <IconButton size="small" onClick={handleEditItem(item.id)}>
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton size="small" onClick={handleDeleteItem(item.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </TableCell>
          );
        }
        if (typeof column.formatter === 'function') {
          return (
            <TableCell
              key={column.id}
              className={cls(column.id !== 'address' ? styles.tableCell : styles.alterCell)}
            >
              {column.formatter(item[column.id], item)}
            </TableCell>
          );
        }
        return (
          <TableCell key={column.id} className={styles.tableCell}>
            {item[column.id]}
          </TableCell>
        );
      })}
    </>
  );

  const renderTableBody = () => {
    const items = paginateOnServer
      ? list
      : list.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    return (
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item.id || index} hover>
            {renderTableItem(item)}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderNoData = () => {
    if (!statuses.initial && !statuses.loading && !list.length) {
      return <div className={styles.noDataWrapper}>Нет данных</div>;
    }

    return null;
  };

  const renderTableLoader = () => {
    if (statuses.initial || statuses.loading) {
      return (
        <div className={styles.loaderWrap}>
          <CircularProgress size={32} />
        </div>
      );
    }

    return null;
  };

  const renderPagination = () => {
    if (hidePagination) {
      return null;
    }

    return (
      <div className={styles.actionsWrap}>
        <TablePagination
          component="div"
          count={paginateOnServer ? meta.total : list.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          labelRowsPerPage="Элементов на странице"
          labelDisplayedRows={getItemsOnPageInfo}
          page={statuses.success ? page : 0}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={PER_PAGE_VARIANTS}
        />
      </div>
    );
  };

  return (
    <div className={styles.SimpleTable}>
      <Table>
        {renderTableHeader()}
        {renderTableBody()}
      </Table>
      {renderNoData()}
      {renderPagination()}
      {renderTableLoader()}
    </div>
  );
}

SimpleTable.propTypes = {
  paginateOnServer: PropTypes.bool,
  hidePagination: PropTypes.bool,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string,
      formatter: PropTypes.func,
    })
  ).isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({})),
  statuses: PropTypes.shape({
    initial: PropTypes.bool,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

SimpleTable.defaultProps = {
  paginateOnServer: false,
  hidePagination: false,
  list: [],
  statuses: {},
  onEdit: undefined,
  onDelete: undefined,
};

export default withRouter(SimpleTable);
