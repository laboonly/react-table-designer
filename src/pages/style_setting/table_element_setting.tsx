import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  IBaseElementType,
  usePrintElementListStore,
  IPrintElementListType,
  useSelectElementInfoStore,
  ISelectElementInfoType,
} from '@/store';
import { Label } from '@/components/ui/label';
import { produce } from 'immer';
import { CardStackMinusIcon } from '@radix-ui/react-icons';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

interface ITableElementSettingProps {
  selectElementInfo: IBaseElementType;
}

export const TableElementSetting: React.FC<ITableElementSettingProps> = (
  props,
) => {
  const { selectElementInfo } = props;
  const { table = { header: {}, columns: [] } } = selectElementInfo;

  const { t } = useTranslation();

  const { changeSelectElementInfo } = useSelectElementInfoStore(
    (state: ISelectElementInfoType) => state,
  );

  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const setTableHeader = (old: string, changeInfo: any) => {
    console.log('setHeader');
    updatePrintElement({
      ...selectElementInfo,
      table: {
        ...selectElementInfo.table,
        columns: selectElementInfo.table?.columns,
        header: {
          ...table.header,
          [old]: changeInfo,
        },
      },
    });
    changeSelectElementInfo({
      ...selectElementInfo,
      table: {
        ...selectElementInfo.table,
        columns: selectElementInfo.table?.columns,
        header: {
          ...table.header,
          [old]: changeInfo,
        },
      },
    });
  };

  // 增加行
  const addRow = () => {
    const newRow: Record<string, any> = {};
    Object.keys(table.header).forEach((item) => {
      const columnKey = table.header[item];
      newRow[columnKey] = '';
    });
    const newElementInfo = produce(selectElementInfo, (draftState) => {
      draftState.table?.columns.push(newRow);
    });
    updatePrintElement(newElementInfo);
    changeSelectElementInfo(newElementInfo);
  };

  // 删除行
  const deleteRow = (rowIndex: number) => {
    const newElementInfo = produce(selectElementInfo, (draftState) => {
      draftState.table?.columns.splice(rowIndex, 1);
    });
    updatePrintElement(newElementInfo);
    changeSelectElementInfo(newElementInfo);
  };

  // 删除列
  const deleteColumn = (item: string) => {
    const newElementInfo = produce(selectElementInfo, (draftState) => {
      delete draftState.table?.header[item];
    });
    updatePrintElement(newElementInfo);
    changeSelectElementInfo(newElementInfo);
  };

  // 增加列
  const addColumn = () => {
    const columnId = nanoid();
    const newElementInfo = produce(selectElementInfo, (draftState) => {
      if (!draftState.table) return;
      draftState.table.header[columnId] = 'new column';
    });
    updatePrintElement(newElementInfo);
    changeSelectElementInfo(newElementInfo);
  };

  return (
    <div>
      <Label className="mb-2 mr-4">Header: </Label>
      {Object.keys(table.header).map((item) => {
        return (
          <div key={item} className="mb-4 flex items-center">
            <Input
              disabled={!selectElementInfo.isEdit}
              value={table.header[item]}
              onChange={(e) => setTableHeader(item, e.target.value)}
            />
            <CardStackMinusIcon
              className="w-4.h mr-2"
              style={{
                cursor: 'pointer',
                marginLeft: '10px',
              }}
              onClick={() => deleteColumn(item)}
            />
          </div>
        );
      })}
      <Button
        className="bottom-0 mt-5 w-[100%]"
        variant="outline"
        onClick={addColumn}
      >
        {t('add_field')}
      </Button>
      <div className="mt-5">
        <Label className="mb-10 mr-4">Rows: </Label>
        {table.columns.map((item: any, index: number) => {
          return (
            <div key={index} className="mb-4 flex items-center">
              <Input disabled={true} value={item[table.header[0]]} />
              <CardStackMinusIcon
                className="w-4.h mr-2"
                style={{
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
                onClick={() => deleteRow(index)}
              />
            </div>
          );
        })}
      </div>
      <Button
        className="bottom-0 mt-5 w-[100%]"
        variant="outline"
        onClick={addRow}
      >
        {t('add_row')}
      </Button>
    </div>
  );
};
