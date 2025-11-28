import dayjs from 'dayjs';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react';

const ArticleTable = ({ data, page, setPage, rowsPerPage, setRowsPerPage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedData = data
    .map((item, index) => ({ ...item, id: index }))
    .sort(
      (a, b) =>
        dayjs(b.date, 'DD.MM.YYYY').unix() - dayjs(a.date, 'DD.MM.YYYY').unix()
    )
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.standort.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setRowsPerPage(parseInt(newSize));
    setPage(0);
  };

  return (
    <div className="w-[95%] mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pressemitteilungen</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nach Titel oder Ort suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs md:text-sm font-semibold">
                    Datum
                  </TableHead>
                  <TableHead className="text-xs md:text-sm font-semibold">
                    Titel
                  </TableHead>
                  <TableHead className="text-xs md:text-sm font-semibold hidden md:table-cell">
                    Quelle
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-xs md:text-sm hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="text-xs">
                        {item.date}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={item.fullArticleURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline flex items-center gap-1 md:hidden"
                      >
                        {item.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <span className="hidden md:inline line-clamp-2">
                        {item.title}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={item.fullArticleURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          Artikel
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-muted/20 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Zeilen pro Seite:
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handlePageSizeChange}
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

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {startIndex + 1}–{Math.min(endIndex, sortedData.length)} von{' '}
                {sortedData.length}
              </span>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleTable;
