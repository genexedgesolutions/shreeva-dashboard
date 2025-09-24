// components/DataTable.jsx
import React, { useMemo, useState } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { FiDownload, FiSearch } from 'react-icons/fi'; // 👈 icons

// Light theme
createTheme('shreeva', {
  text: { primary: '#0f1724', secondary: '#6b7280' },
  background: { default: '#ffffff' },
  divider: { default: '#e6eef6' },
});

export default function AppDataTable({
  columns = [],
  data = [],
  title = '',
  selectable = false,
  defaultSortFieldId = '',
  dense = false,
}) {
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const colsWithId = useMemo(() => {
    return columns.map((c, idx) => {
      const id = c.id || (c.name ? c.name.replace(/\s+/g, '_').toLowerCase() : `col_${idx}`);
      return { ...c, id };
    });
  }, [columns]);

  const filteredItems = useMemo(() => {
    if (!filterText) return data;
    const q = filterText.toLowerCase();
    return data.filter((row) => {
      return colsWithId.some((col) => {
        try {
          const val = typeof col.selector === 'function' ? col.selector(row) : row[col.selector];
          return (val ?? '').toString().toLowerCase().includes(q);
        } catch {
          return false;
        }
      });
    });
  }, [data, filterText, colsWithId]);

  const csvHeaders = useMemo(() => {
    return colsWithId.map((c) => ({ label: c.name, key: c.id }));
  }, [colsWithId]);

  const csvRows = useMemo(() => {
    return filteredItems.map((row) => {
      const obj = {};
      colsWithId.forEach((col) => {
        const key = col.id;
        let val;
        try {
          val = typeof col.selector === 'function' ? col.selector(row) : row[col.selector];
        } catch {
          val = '';
        }
        if (val == null) obj[key] = '';
        else if (val instanceof Date) obj[key] = val.toISOString();
        else if (typeof val === 'object') obj[key] = JSON.stringify(val);
        else obj[key] = val;
      });
      return obj;
    });
  }, [filteredItems, colsWithId]);

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const subHeader = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Search input with icon */}
      <div style={{ position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', color: '#888' }} />
        <input
          type="search"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            padding: '8px 10px 8px 32px',
            borderRadius: 8,
            border: '1px solid rgba(15,23,36,0.06)',
            minWidth: 200,
          }}
        />
      </div>

      {/* Export CSV button with icon */}
      <CSVLink
        data={csvRows}
        headers={csvHeaders}
        filename={(title || 'export') + '.csv'}
        className="btn ghost"
        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <FiDownload /> Export CSV
      </CSVLink>

      {selectable && selectedRows.length > 0 && (
        <div style={{ marginLeft: 8, fontSize: 13 }} className="kv muted">
          {selectedRows.length} selected
        </div>
      )}
    </div>
  );

  return (
    <div>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}

      <DataTable
        columns={colsWithId}
        data={filteredItems}
        defaultSortFieldId={defaultSortFieldId}
        pagination
        dense={dense}
        highlightOnHover
        selectableRows={selectable}
        onSelectedRowsChange={handleRowSelected}
        subHeader
        subHeaderComponent={subHeader}
        theme="shreeva"
        responsive
      />
    </div>
  );
}
