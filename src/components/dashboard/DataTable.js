'use client';
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import styles from '@/app/dashboard/dashboard.module.css';

const DataTable = ({ data, columns, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      </div>
      <div className={`overflow-x-auto ${styles['data-table-container']}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={styles['table-row-alternate']}>
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={`${rowIndex}-${colIndex}`} 
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {column.accessor ? row[column.accessor] : column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
