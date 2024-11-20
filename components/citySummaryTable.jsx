import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

const CitySummaryTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);

  const locationCount = data.reduce((acc, row) => {
    acc[row.standort] = (acc[row.standort] || 0) + 1;
    return acc;
  }, {});

  const summaryData = Object.entries(locationCount)
    .map(([standort, count]) => ({ standort, count }))
    .sort((a, b) => b.count - a.count); // Sortieren nach der Anzahl der Artikel

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const locationCount2 = data.reduce((acc, row) => {
    if (row.bundesland) {
      acc[row.bundesland] = (acc[row.bundesland] || 0) + 1;
    }
    return acc;
  }, {});

  const totalBundesland = Object.values(locationCount2).reduce((sum, count) => sum + count, 0);

  const summaryData2 = Object.entries(locationCount2)
    .map(([bundesland, count]) => ({ bundesland, count, percentage: ((count / totalBundesland) * 100).toFixed(2) }))
    .sort((a, b) => b.count - a.count); // Sortieren nach der Anzahl der Artikel

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={{ xs: 4, sm: 12, md: 12 }}>
          <Grid size={6}>
            <Paper sx={{ width: '60%', overflow: 'hidden', margin: '0 auto', backgroundColor: 'rgb(240, 240, 240)', marginTop: '20px' }}>
              <TableContainer sx={{ backgroundColor: 'transparent', height: '400px' }}>
                <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead sx={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          '@media (max-width: 600px)': {
                            fontSize: '0.75rem',
                            padding: '8px',
                          },
                        }}
                      >
                        Standort
                      </TableCell>
                      <TableCell
                        sx={{
                          '@media (max-width: 600px)': {
                            fontSize: '0.75rem',
                            padding: '8px',
                          },
                        }}
                      >
                        Anzahl der Artikel
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          sx={{
                            '@media (max-width: 600px)': {
                              fontSize: '0.75rem',
                              padding: '8px',
                            },
                          }}
                        >
                          {row.standort}
                        </TableCell>
                        <TableCell
                          sx={{
                            '@media (max-width: 600px)': {
                              fontSize: '0.75rem',
                              padding: '8px',
                            },
                          }}
                        >
                          {row.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={summaryData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Zeilen pro Seite"
                sx={{
                  backgroundColor: 'rgb(240, 240, 240)',
                  '@media (max-width: 600px)': {
                    '.MuiTablePagination-toolbar': {
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontSize: '0.75rem',
                    },
                    '.MuiTablePagination-select': {
                      fontSize: '0.75rem',
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
          <Grid size={6}>
            <Paper sx={{ width: '60%', overflow: 'hidden', margin: '0 auto', backgroundColor: 'rgb(240, 240, 240)', marginTop: '20px' }}>
              <TableContainer sx={{ backgroundColor: 'transparent', height: '400px' }}>
                <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead sx={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          '@media (max-width: 600px)': {
                            fontSize: '0.75rem',
                            padding: '8px',
                          },
                        }}
                      >
                        Bundesland
                      </TableCell>
                      <TableCell
                        sx={{
                          '@media (max-width: 600px)': {
                            fontSize: '0.75rem',
                            padding: '8px',
                          },
                        }}
                      >
                        Anzahl der Artikel
                      </TableCell>
                      <TableCell
                        sx={{
                          '@media (max-width: 600px)': {
                            fontSize: '0.75rem',
                            padding: '8px',
                          },
                        }}
                      >
                        Prozent
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryData2.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          sx={{
                            '@media (max-width: 600px)': {
                              fontSize: '0.75rem',
                              padding: '8px',
                            },
                          }}
                        >
                          {row.bundesland}
                        </TableCell>
                        <TableCell
                          sx={{
                            '@media (max-width: 600px)': {
                              fontSize: '0.75rem',
                              padding: '8px',
                            },
                          }}
                        >
                          {row.count}
                        </TableCell>
                        <TableCell
                          sx={{
                            '@media (max-width: 600px)': {
                              fontSize: '0.75rem',
                              padding: '8px',
                            },
                          }}
                        >
                          {row.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={summaryData2.length}
                rowsPerPage={rowsPerPage2}
                page={page2}
                onPageChange={handleChangePage2}
                onRowsPerPageChange={handleChangeRowsPerPage2}
                labelRowsPerPage="Zeilen pro Seite"
                sx={{
                  backgroundColor: 'rgb(240, 240, 240)',
                  '@media (max-width: 600px)': {
                    '.MuiTablePagination-toolbar': {
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontSize: '0.75rem',
                    },
                    '.MuiTablePagination-select': {
                      fontSize: '0.75rem',
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CitySummaryTable;