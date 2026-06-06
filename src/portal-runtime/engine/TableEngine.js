import { useMemo, useState } from "react";

export function useTableEngine(defaultPageSize = 10) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dir, setDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const params = useMemo(
    () => ({
      search,
      sort,
      dir,
      page,
      pageSize,
    }),
    [dir, page, pageSize, search, sort]
  );

  function toggleSort(key) {
    setPage(1);
    if (sort === key) {
      setDir((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(key);
    setDir("asc");
  }

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return {
    params,
    search,
    setSearch: updateSearch,
    sort,
    dir,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize: (value) => {
      setPageSize(value);
      setPage(1);
    },
  };
}
