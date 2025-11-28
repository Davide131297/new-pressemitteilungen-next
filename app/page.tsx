'use client';

import React from 'react';
import 'dayjs/locale/de';
import Search from '../components/search';
import ArticleTable from '../components/articleTable';
import Welcome from '@/components/welcome';
import TextBox from '@/components/textBox';
import { Card } from '@/components/ui/card';
import { useSearch } from '@/hooks/useSearch';

function Home() {
  const {
    query,
    setQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    data,
    loading,
    elapsedTime,
    handleApiCall,
    handleStopSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  } = useSearch();

  return (
    <div className="w-11/12 mx-auto mb-5">
      <Card className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-0 shadow-xl p-5">
        <Search
          query={query}
          setQuery={setQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleApiCall={handleApiCall}
          loading={loading}
          elapsedTime={elapsedTime}
          data={data}
          handleStopSearch={handleStopSearch}
        />
        {data.length !== 0 && (
          <div className="mt-2">
            <div className="flex justify-center">
              <ArticleTable
                data={data}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </div>
        )}
        {!data.length && <Welcome />}
        {data && data.length > 0 && <TextBox data={data} />}
      </Card>
    </div>
  );
}

export default Home;
