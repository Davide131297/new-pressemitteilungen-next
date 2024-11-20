import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

const ArticleTable = ({
    data,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
}) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const sortedData = data.map((item, index) => ({ ...item, id: index })).sort((a, b) => dayjs(b.date, 'DD.MM.YYYY').unix() - dayjs(a.date, 'DD.MM.YYYY').unix());

    const columns = isMobile ? [
        { field: 'date', headerName: 'Datum', flex: 1 },
        { field: 'titel', headerName: 'Titel', flex: 2, renderCell: (params) => (
            <a href={params.row.fullArticleURL} target="_blank" rel="noopener noreferrer">
                {params.value}
            </a>
        ) },
        { field: 'standort', headerName: 'Ort', flex: 1 },
    ] : [
        { field: 'date', headerName: 'Datum', flex: 1 },
        { field: 'titel', headerName: 'Titel', flex: 2 },
        { field: 'standort', headerName: 'Ort', flex: 1 },
        { field: 'fullArticleURL', headerName: 'Quelle', flex: 1, renderCell: (params) => (
            <a href={params.value} target="_blank" rel="noopener noreferrer">
                Zum Artikel
            </a>
        ) },
    ];

    const handlePageChange = (params) => {
        setPage(params.page);
    };

    const handlePageSizeChange = (params) => {
        setRowsPerPage(params.pageSize);
        setPage(0);
    };

    const localeText = {
        // Übersetzungen für die DataGrid-Komponenten
        noRowsLabel: 'Keine Zeilen',
        noResultsOverlayLabel: 'Keine Ergebnisse gefunden.',
        errorOverlayDefaultLabel: 'Ein Fehler ist aufgetreten.',
        toolbarDensity: 'Dichte',
        toolbarDensityLabel: 'Dichte',
        toolbarDensityCompact: 'Kompakt',
        toolbarDensityStandard: 'Standard',
        toolbarDensityComfortable: 'Bequem',
        toolbarColumns: 'Spalten',
        toolbarColumnsLabel: 'Spalten auswählen',
        toolbarFilters: 'Filter',
        toolbarFiltersLabel: 'Filter anzeigen',
        toolbarExport: 'Export',
        toolbarExportLabel: 'Exportieren',
        columnsPanelTextFieldLabel: 'Spalte finden',
        columnsPanelTextFieldPlaceholder: 'Spaltentitel',
        columnsPanelDragIconLabel: 'Spalte neu anordnen',
        columnsPanelShowAllButton: 'Alle anzeigen',
        columnsPanelHideAllButton: 'Alle ausblenden',
        filterPanelAddFilter: 'Filter hinzufügen',
        filterPanelDeleteIconLabel: 'Löschen',
        filterPanelOperators: 'Operatoren',
        filterPanelOperatorAnd: 'Und',
        filterPanelOperatorOr: 'Oder',
        filterPanelColumns: 'Spalten',
        filterPanelInputLabel: 'Wert',
        filterPanelInputPlaceholder: 'Filterwert',
        filterOperatorContains: 'enthält',
        filterOperatorEquals: 'gleich',
        filterOperatorStartsWith: 'beginnt mit',
        filterOperatorEndsWith: 'endet mit',
        filterOperatorIs: 'ist',
        filterOperatorNot: 'ist nicht',
        filterOperatorAfter: 'nach',
        filterOperatorOnOrAfter: 'am oder nach',
        filterOperatorBefore: 'vor',
        filterOperatorOnOrBefore: 'am oder vor',
        filterOperatorIsEmpty: 'ist leer',
        filterOperatorIsNotEmpty: 'ist nicht leer',
        filterOperatorIsAnyOf: 'ist einer von',
        columnMenuLabel: 'Menü',
        columnMenuShowColumns: 'Spalten anzeigen',
        columnMenuFilter: 'Filter',
        columnMenuHideColumn: 'Ausblenden',
        columnMenuUnsort: 'Sortierung aufheben',
        columnMenuSortAsc: 'Aufsteigend sortieren',
        columnMenuSortDesc: 'Absteigend sortieren',
        columnHeaderFiltersTooltipActive: (count) => `${count} aktive Filter`,
        columnHeaderFiltersLabel: 'Filter anzeigen',
        columnHeaderSortIconLabel: 'Sortieren',
        footerRowSelected: (count) => `${count.toLocaleString()} Zeile(n) ausgewählt`,
        footerTotalRows: 'Gesamtanzahl Zeilen:',
        footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} von ${totalCount.toLocaleString()}`,
        checkboxSelectionHeaderName: 'Checkbox-Auswahl',
        booleanCellTrueLabel: 'ja',
        booleanCellFalseLabel: 'nein',
        actionsCellMore: 'mehr',
    };

    return (
        <Paper sx={{ width: '95%', height: 'calc(100vh - 300px)', overflow: 'hidden', margin: '0 auto' }}>
            <DataGrid
                rows={sortedData}
                columns={columns}
                pageSize={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                pagination
                page={page}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                localeText={localeText}
                sx={{
                    backgroundColor: 'rgb(240, 240, 240)',
                    fontSize: isMobile ? '9px' : '12px', // Schriftgröße anpassen
                }}
            />
        </Paper>
    );
};

export default ArticleTable;