"use client";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Search,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Field,
  Row,
  Select,
  Text,
} from "./ui";
export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  exportValue?: (row: T) => string;
}
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchText,
  onSelect,
  filter,
  caption = "Records",
  resourceName = "appointments",
  server,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  onSelect?: (row: T) => void;
  filter?: ReactNode;
  caption?: string;
  resourceName?: string;
  server?: {
    page: number;
    limit: number;
    total: number;
    search: string;
    onPage: (value: number) => void;
    onLimit: (value: number) => void;
    onSearch: (value: string) => void;
  };
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [localPage, setLocalPage] = useState(1);
  const [sort, setSort] = useState("");
  const [descending, setDescending] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [showColumns, setShowColumns] = useState(false);
  const [localSize, setLocalSize] = useState(5);
  const search = server?.search ?? localSearch;
  const setSearch = server?.onSearch ?? setLocalSearch;
  const page = server?.page ?? localPage;
  const setPage = server?.onPage ?? setLocalPage;
  const size = server?.limit ?? localSize;
  const setSize = server?.onLimit ?? setLocalSize;
  const filtered = useMemo(() => {
    const result = rows.filter(
      (r) =>
        !!server || searchText(r).toLowerCase().includes(search.toLowerCase()),
    );
    const col = columns.find((c) => c.id === sort);
    if (col?.sortValue)
      result.sort((a, b) => {
        const x = col.sortValue!(a),
          y = col.sortValue!(b);
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y))) * (descending ? -1 : 1)
        );
      });
    return result;
  }, [rows, search, searchText, columns, sort, descending, server]);
  const total = server?.total ?? filtered.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(page, pages);
  const visible = columns.filter((c) => !hidden.includes(c.id));
  function exportCsv() {
    const safe = (s: string) =>
      `"${(/^[=+@\-]/.test(s) ? "'" : "") + s.replaceAll('"', '""')}"`;
    const csv = [
      visible.map((c) => safe(c.label)).join(","),
      ...filtered.map((r) =>
        visible
          .map((c) =>
            safe(c.exportValue?.(r) ?? String(c.sortValue?.(r) ?? "")),
          )
          .join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `vellure-${resourceName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <Row className="v-table-toolbar between">
        <Row>
          <div className="v-table-search">
            <Search size={15} />
            <Field
              label={`Search ${resourceName}`}
              placeholder={`Search ${resourceName}…`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {filter}
        </Row>
        <Row>
          <Button
            variant="ghost"
            onClick={() => setShowColumns(!showColumns)}
            aria-expanded={showColumns}
          >
            <Columns3 size={15} />
            <span className="hide-small">Columns</span>
          </Button>
          <Button variant="ghost" onClick={exportCsv}>
            <Download size={15} />
            <span className="hide-small">Export</span>
          </Button>
        </Row>
      </Row>
      {showColumns && (
        <Row className="v-column-picker">
          {columns.map((c) => (
            <Checkbox
              key={c.id}
              label={c.label}
              checked={!hidden.includes(c.id)}
              disabled={visible.length === 1 && !hidden.includes(c.id)}
              onChange={() =>
                setHidden(
                  hidden.includes(c.id)
                    ? hidden.filter((id) => id !== c.id)
                    : [...hidden, c.id],
                )
              }
            />
          ))}
        </Row>
      )}
      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${resourceName} found`}
          description="Try another name or change your filters."
          action={<Button onClick={() => setSearch("")}>Clear search</Button>}
        />
      ) : (
        <div className="v-table-scroll">
          <table className="v-table">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                {visible.map((c) => (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={
                      sort === c.id
                        ? descending
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    {c.sortValue ? (
                      <button
                        onClick={() => {
                          setSort(c.id);
                          setDescending(sort === c.id ? !descending : false);
                        }}
                      >
                        {c.label}
                        <ArrowDownUp size={12} />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                ))}
                {onSelect && (
                  <th scope="col">
                    <span className="sr-only">View detail</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered
                .slice(
                  server ? 0 : (current - 1) * size,
                  server ? rows.length : current * size,
                )
                .map((row) => (
                  <tr key={row.id}>
                    {visible.map((c) => (
                      <td key={c.id}>{c.render(row)}</td>
                    ))}
                    {onSelect && (
                      <td>
                        <Button
                          variant="ghost"
                          onClick={() => onSelect(row)}
                          aria-label={`View ${row.id}`}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Row className="v-table-footer between">
        <Text muted>
          Showing {filtered.length ? (current - 1) * size + 1 : 0}–
          {Math.min(current * size, total)} of {total} {resourceName}
        </Text>
        <Row>
          <Select
            label="Rows per page"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
            options={[5, 10, 20, 25, 50].map((n) => ({
              value: String(n),
              label: `${n} / page`,
            }))}
          />
          <Button
            variant="ghost"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <Badge>{current}</Badge>
          <Button
            variant="ghost"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </Row>
      </Row>
    </>
  );
}
