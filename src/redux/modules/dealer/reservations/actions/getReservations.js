import {
  RESERVATIONS_FETCH_START,
  RESERVATIONS_FETCH_END,
  RESERVATIONS_FETCH_ERROR,
  RESERVATIONS_LIST_LOADED,
} from '../types';

import { dealerReservationsRequests } from '../../../../../api';

import { DEALER_ID_KEY } from '../../../../../constants';

export default function getReservations() {
  return async dispatch => {
    try {
      dispatch({ type: RESERVATIONS_FETCH_START });

      const id = localStorage.getItem(DEALER_ID_KEY);
      const { error, data } = await dealerReservationsRequests.getList(id);

      if (error) {
        dispatch({ type: RESERVATIONS_FETCH_ERROR, data: error });
        return;
      }

      dispatch({ type: RESERVATIONS_LIST_LOADED, data });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      dispatch({
        type: RESERVATIONS_FETCH_ERROR,
        data: { message: 'Ошибка получения списка бронирований' },
      });
    } finally {
      dispatch({ type: RESERVATIONS_FETCH_END });
    }
  };
}
