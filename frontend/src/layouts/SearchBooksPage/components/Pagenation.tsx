import { RenderPagination } from "../../../utils/pagination";

export const Pagenation: React.FC<{
  displayPage: number;
  totalPages: number;
  maxPageLinks: number;
  paginate: (page: number) => void;
}> = ({ displayPage, totalPages, maxPageLinks, paginate }) => {
  return (
    <nav aria-label="...">
      <ul className="pagination">
        <li className="page-item" onClick={() => paginate(1)}>
          <button className="page-link">最初</button>
        </li>
        {RenderPagination(displayPage, totalPages, maxPageLinks).map((page) => (
          <li
            key={page}
            onClick={() => paginate(page)}
            className={"page-item" + (displayPage === page ? "active" : "")}
          >
            <button className="page-link">{page}</button>
          </li>
        ))}
        <li className="page-item" onClick={() => paginate(totalPages)}>
          <button className="page-link">最後</button>
        </li>
      </ul>
    </nav>
  );
};
