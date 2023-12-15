import {
  ColumnDef,
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import {
  usePrintElementListStore,
  IPrintElementListType,
  IBaseElementType,
} from '@/store';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface ITablePropsType {
  elementInfo: IBaseElementType;
}

type TableData = {
  header: Record<string, unknown>;
  columns: Array<unknown>;
};

const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id, getSize }, table }) => {
    const initialValue = getValue();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        style={{
          width: getSize(),
          textAlign: 'center',
          backgroundColor: 'transparent',
        }}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

export const TableComponent: React.FC<ITablePropsType> = (props) => {
  const { elementInfo } = props;
  const { table: tableData = { header: {}, columns: [] } } = elementInfo;
  const [data, setData] = useState([...tableData.columns]);

  const columnHelper =
    createColumnHelper<{ [key in keyof TableData['header']]: string }>();

  const columns = useMemo(() => {
    return Object.keys(tableData.header).map((item) => {
      return columnHelper.accessor(tableData.header[item], {
        footer: (info) => info.column.id,
      });
    });
  }, [tableData.header]);

  useEffect(() => {
    setData([...tableData.columns]);
  }, [tableData]);

  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const updateTableElement = (newData: any) => {
    updatePrintElement({
      ...elementInfo,
      table: {
        ...tableData,
        columns: newData,
      },
    });
  };

  const table = useReactTable({
    defaultColumn,
    columns,
    data,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...data[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        });
        setData(newData);
        updateTableElement(newData);
      },
    },
  });

  return (
    <table
      className="w-full border-collapse border border-black"
      style={{
        textAlign: 'center',
      }}
    >
      <thead className="w-full">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="relative border border-black"
                colSpan={header.colSpan}
                style={{
                  width: header.getSize(),
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {header.column.getCanResize() && (
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`,
                    }}
                  />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border border-black"
                style={{
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
