import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import validate from 'validate.js';
import _get from 'lodash/get';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/styles';

import ErrorShower from '../../../../organisms/Admin/ErrorShower';

import { dealerSchema } from './schema';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    overflowY: 'scroll',
  },
  actionsWrap: {
    justifyContent: 'flex-end',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  confirmWrap: {
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.white,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function PersonalForm(props) {
  const { texts, dealer, statuses, /* onSubmit, */ onCloseError } = props;
  const styles = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      trade_name: dealer.trade_name || '',
      legal_name: dealer.legal_name || '',
      official_dealer: Boolean(dealer.official_dealer),
      used_car_saling: Boolean(dealer.used_car_saling),
      phone: _get(dealer, 'contact_infos.0.value', ''),
      code: dealer.code || '',
      rate: _get(dealer, 'rate', 0),
      postcode: _get(dealer, 'address.postcode', ''),
      country: _get(dealer, 'address.country', ''),
      region: _get(dealer, 'address.region', ''),
      city: _get(dealer, 'address.city', ''),
      street: _get(dealer, 'address.street', ''),
      building: _get(dealer, 'address.building', ''),
      locationX: _get(dealer, 'address.location.x', ''),
      locationY: _get(dealer, 'address.location.y', ''),
    },
    touched: {},
    errors: {},
  });

  useEffect(() => {
    const errors = validate(formState.values, dealerSchema);

    setFormState(oldFormState => ({
      ...oldFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, dealer.id]);

  const handleChange = event => {
    event.persist();
    const { name, type, value, checked } = event.target;
    setFormState(oldFormState => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        [name]: type === 'checkbox' ? checked : value,
      },
      touched: {
        ...oldFormState.touched,
        [name]: true,
      },
    }));
  };

  const changeRating = (event, value) => {
    event.persist();
    const { name } = event.target;
    setFormState(oldFormState => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        [name]: value,
      },
      touched: {
        ...oldFormState.touched,
        [name]: true,
      },
    }));
  };

  const hasError = field => Boolean(formState.touched[field] && formState.errors[field]);

  // const handleSubmitForm = event => {
  //   event.preventDefault();
  //   if (!formState.isValid) {
  //     return;
  //   }
  //   onSubmit(formState.values);
  // };

  return (
    <Card className={styles.root}>
      <form autoComplete="off" noValidate>
        <CardHeader subheader={texts.subtitle} title={texts.title} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Общая информация</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('legal_name')}
                helperText={hasError('legal_name') ? formState.errors.legal_name[0] : null}
                label="Юридическое название ДЦ"
                margin="dense"
                name="legal_name"
                onChange={handleChange}
                required
                value={formState.values.legal_name}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('trade_name')}
                helperText={hasError('trade_name') ? formState.errors.trade_name[0] : null}
                label="Торговое название ДЦ"
                margin="dense"
                name="trade_name"
                onChange={handleChange}
                required
                value={formState.values.trade_name}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('phone')}
                helperText={hasError('phone') ? formState.errors.phone[0] : null}
                label="Номер телефона"
                margin="dense"
                name="phone"
                onChange={handleChange}
                required
                value={formState.values.phone}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('code')}
                helperText={hasError('code') ? formState.errors.code[0] : null}
                label="Код ДЦ"
                margin="dense"
                name="code"
                onChange={handleChange}
                value={formState.values.code}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Официальный дилер"
                name="official_dealer"
                checked={formState.values.official_dealer}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Продажа б/у"
                name="used_car_saling"
                checked={formState.values.used_car_saling}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Рейтинг</Typography>
              <Rating name="rate" value={formState.values.rate} onChange={changeRating} disabled />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Фактический адрес</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('postcode')}
                helperText={hasError('postcode') ? formState.errors.postcode[0] : null}
                label="Почтовый индекс"
                margin="dense"
                name="postcode"
                onChange={handleChange}
                value={formState.values.postcode}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('country')}
                helperText={hasError('country') ? formState.errors.country[0] : null}
                label="Страна"
                margin="dense"
                name="country"
                onChange={handleChange}
                value={formState.values.country}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('region')}
                helperText={hasError('region') ? formState.errors.region[0] : null}
                label="Регион"
                margin="dense"
                name="region"
                onChange={handleChange}
                value={formState.values.region}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('city')}
                helperText={hasError('city') ? formState.errors.city[0] : null}
                label="Город"
                margin="dense"
                name="city"
                onChange={handleChange}
                required
                value={formState.values.city}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('street')}
                helperText={hasError('street') ? formState.errors.street[0] : null}
                label="Улица"
                margin="dense"
                name="street"
                onChange={handleChange}
                required
                value={formState.values.street}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('building')}
                helperText={hasError('building') ? formState.errors.building[0] : null}
                label="Номер дома"
                margin="dense"
                name="building"
                onChange={handleChange}
                required
                value={formState.values.building}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Координаты</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('locationX')}
                helperText={hasError('locationX') ? formState.errors.locationX[0] : null}
                label="Широта"
                margin="dense"
                name="locationX"
                onChange={handleChange}
                required
                value={formState.values.locationX}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={hasError('locationY')}
                helperText={hasError('locationY') ? formState.errors.locationY[0] : null}
                label="Долгота"
                margin="dense"
                name="locationY"
                onChange={handleChange}
                required
                value={formState.values.locationY}
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={styles.actionsWrap}>
          <div className={styles.confirmWrap}>
            <Button
              color="primary"
              variant="contained"
              href="mailto:driveclick@cetelem.ru"
              // disabled={!formState.isValid || statuses.loading}
            >
              {texts.submit}
            </Button>
            {statuses.loading && <CircularProgress size={24} className={styles.buttonProgress} />}
          </div>
        </CardActions>
      </form>
      <ErrorShower
        open={Boolean(statuses.error)}
        message={_get(statuses, 'error.message')}
        onClose={onCloseError}
        position={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
    </Card>
  );
}

PersonalForm.propTypes = {
  texts: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    submit: PropTypes.string,
  }).isRequired,
  dealer: PropTypes.shape({
    id: PropTypes.number,
  }),
  // onSubmit: PropTypes.func.isRequired,
  onCloseError: PropTypes.func.isRequired,
};

PersonalForm.defaultProps = {
  dealer: {
    id: null,
  },
};

export default PersonalForm;
