import axios from 'axios';

export const getTableRecordsData = (tableId: string, viewId: string) => {
  return axios.get(`https://dev.teable.io/api/table/${tableId}/record`, {
    params: {
      viewId: viewId,
      fieldKeyType: 'id',
      cellFormat: 'text',
    },
  });
};

export const getTablefieldsData = (tableId: string, viewId: string) => {
  return axios.get(`https://dev.teable.io/api/table/${tableId}/field`, {
    params: {
      viewId: viewId,
    },
  });
};
