export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-3 mt-4">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
