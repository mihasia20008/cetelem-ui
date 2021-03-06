import { filtersRequests } from '../../../../api';

import * as T from '../types';

import { FILTER_TYPES, FILTER_NAMES, FLOAT_RANGE } from "../../../../constants";

const baseNameMap = {
  [`${FILTER_NAMES.BODY_TYPE}`]: 'Все типы кузова',
  [`${FILTER_NAMES.GEARBOX}`]: 'Любая коробка передач',
  [`${FILTER_NAMES.COLOR}`]: 'Все цвета',
  [`${FILTER_NAMES.ENGINE_TYPE}`]: 'Все виды двигателя',
  [`${FILTER_NAMES.STATE}`]: 'Все состояния',
  [`${FILTER_NAMES.WHEEL}`]: 'Все виды руля',
  [`${FILTER_NAMES.YEAR}`]: 'Год, от-до',
  [`${FILTER_NAMES.ENGINE_HP}`]: 'Мощность (л/с), от-до',
  [`${FILTER_NAMES.ENGINE_VOLUME}`]: 'Объем двигателя (л), от-до',
  [`${FILTER_NAMES.PRICE}`]: 'Цена, от-до',
  [`${FILTER_NAMES.RUN}`]: 'Пробег (км), от-до',
  [`${FILTER_NAMES.DRIVE}`]: 'Любой привод',
  [`${FILTER_NAMES.AVAILABLE}`]: 'Любой статус',
};

const baseUnitsMap = {
  [`${FILTER_NAMES.YEAR}`]: '',
  [`${FILTER_NAMES.ENGINE_HP}`]: ' л/с',
  [`${FILTER_NAMES.ENGINE_VOLUME}`]: ' л',
  [`${FILTER_NAMES.PRICE}`]: ' ₽',
  [`${FILTER_NAMES.RUN}`]: ' км',
};

function prepareFilters(filters) {
  return Object.keys(filters).reduce((acc, key) => {
    switch (filters[key].type) {
      case FILTER_TYPES.RANGE: {
        acc[key] = {
          type: FILTER_TYPES.RANGE,
          text: baseNameMap[key] || filters[key].text,
          unit: baseUnitsMap[key],
          min: filters[key].min,
          max: filters[key].max,
          values: [filters[key].min, filters[key].max],
          step: FLOAT_RANGE.includes(key) ? 0.2 : 1,
        };
        break;
      }
      case FILTER_TYPES.CHECKBOX: {
        acc[key] = {
          type: FILTER_TYPES.CHECKBOX,
          active: -1,
          options: [
            {
              id: 1,
              name: 'Новые',
            },
            {
              id: 0,
              name: 'БУ',
            },
          ],
        };
        break;
      }
      case FILTER_TYPES.SELECT: {
        const serverOptions = filters[key].options;
        const preparedOptions = serverOptions.map((name, index) => ({
          id: index + 1,
          name,
        }));
        acc[key] = {
          text: filters[key].text,
          type: filters[key].type,
          active: -1,
          options: [
            {
              id: 0,
              name: baseNameMap[key],
            },
            ...preparedOptions,
          ],
        };
        break;
      }
      default: {
        break;
      }
    }

    return acc;
  }, {});
}

export default function getBaseFilters() {
  return async dispatch => {
    try {
      dispatch({ type: T.FILTERS_BASE_FETCH_START });
      const { error, data } = await filtersRequests.getBaseList();

      if (error) {
        dispatch({ type: T.FILTERS_BASE_FETCH_ERROR, data: error });
        return;
      }

      const filters = prepareFilters(data);
      dispatch({ type: T.FILTERS_BASE_SUCCESS_LOADED, data: filters });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      dispatch({
        type: T.FILTERS_BASE_FETCH_ERROR,
        data: { message: 'Ошибка получения данных с сервера' },
      });
    } finally {
      dispatch({ type: T.FILTERS_BASE_FETCH_END });
    }
  };
}
