import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import clsx from "clsx";
import { pagination } from "../utils/functions";

export default function Pagination({
  items,
  itemsPerPage,
  totalItems,
  outOf = true,
  setPaginationItems,
}: {
  items: any[];
  itemsPerPage: number;
  totalItems: number;
  outOf?: boolean;
  setPaginationItems: Function;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let pageNumbers: number[] = [];

  pageNumbers = pagination(currentPage, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    setPaginationItems((items || []).slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, items.length]);

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage === pageNumbers[pageNumbers.length - 1]) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      {outOf ? (
        <div className="dashboard-outOf">
          Affichage{" "}
          <span>
            {indexOfFirstItem}-{indexOfLastItem}{" "}
          </span>
          sur <span>{totalItems}</span>
        </div>
      ) : null}
      <div className="dashboard-pagination">
        <ul className="pagination">
          <li>
            <button
              type="button"
              className={clsx(currentPage <= 1 ? "is-disable" : null)}
              onClick={handlePreviousPage}
            >
              {"«"}
            </button>
          </li>
          {pageNumbers.map((n, index) =>
            n === 0 ? (
              <li key={index} className="pagination__more">
                <Icon name="more" width="16" height="12" />
              </li>
            ) : (
              <li
                key={index}
                className={clsx(currentPage === n ? "is-active" : null)}
              >
                <button type="button" onClick={() => setCurrentPage(n)}>
                  {n}
                </button>
              </li>
            )
          )}
          <li>
            <button
              type="button"
              className={clsx(
                currentPage === pageNumbers[pageNumbers.length - 1]
                  ? "is-disable"
                  : null
              )}
              onClick={handleNextPage}
            >
              {"»"}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
