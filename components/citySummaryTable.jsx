import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    .sort((a, b) => b.count - a.count);

  const locationCount2 = data.reduce((acc, row) => {
    if (row.bundesland) {
      acc[row.bundesland] = (acc[row.bundesland] || 0) + 1;
    }
    return acc;
  }, {});

  const totalBundesland = Object.values(locationCount2).reduce(
    (sum, count) => sum + count,
    0
  );

  const summaryData2 = Object.entries(locationCount2)
    .map(([bundesland, count]) => ({
      bundesland,
      count,
      percentage: ((count / totalBundesland) * 100).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count);

  const CustomPagination = ({
    page,
    rowsPerPage,
    totalRows,
    onPageChange,
    onRowsPerPageChange,
    label = 'Zeilen pro Seite',
  }) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startRow = page * rowsPerPage + 1;
    const endRow = Math.min((page + 1) * rowsPerPage, totalRows);

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div className="flex items-center space-x-2 text-sm">
          <span>{label}:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span>
            {startRow}-{endRow} von {totalRows}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[95%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Standorte</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 overflow-auto p-4">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50">
                  <TableRow>
                    <TableHead className="text-sm sm:text-base">
                      Standort
                    </TableHead>
                    <TableHead className="text-sm sm:text-base">
                      Anzahl der Artikel
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index} className="hover:bg-gray-100">
                        <TableCell className="text-sm sm:text-base">
                          {row.standort}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {row.count}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <CustomPagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalRows={summaryData.length}
              onPageChange={setPage}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              }}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Bundesländer</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 overflow-auto p-4">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-50">
                  <TableRow>
                    <TableHead className="text-sm sm:text-base">
                      Bundesland
                    </TableHead>
                    <TableHead className="text-sm sm:text-base">
                      Anzahl der Artikel
                    </TableHead>
                    <TableHead className="text-sm sm:text-base">
                      Prozent
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryData2
                    .slice(
                      page2 * rowsPerPage2,
                      page2 * rowsPerPage2 + rowsPerPage2
                    )
                    .map((row, index) => (
                      <TableRow key={index} className="hover:bg-gray-100">
                        <TableCell className="text-sm sm:text-base">
                          {row.bundesland}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {row.count}
                        </TableCell>
                        <TableCell className="text-sm sm:text-base">
                          {row.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <CustomPagination
              page={page2}
              rowsPerPage={rowsPerPage2}
              totalRows={summaryData2.length}
              onPageChange={setPage2}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage2(newRowsPerPage);
                setPage2(0);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitySummaryTable;
