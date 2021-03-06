import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  searchInput: {
    minWidth: '420px',
    marginRight: theme.spacing(1)
  }
}));

const DealersToolbar = props => {
  const { className, onOpenCreateForm, ...rest } = props;

  const styles = useStyles();

  return (
    <div
      {...rest}
      className={cls(styles.root, className)}
    >
      <div className={styles.row} />
      <div className={styles.row}>
        <span className={styles.spacer} />
        <Button
          color="primary"
          variant="contained"
          onClick={onOpenCreateForm}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
};

DealersToolbar.propTypes = {
  className: PropTypes.string,
  onOpenCreateForm: PropTypes.func.isRequired,
};


DealersToolbar.defaultProps = {
  className: undefined,
};

export default DealersToolbar;
