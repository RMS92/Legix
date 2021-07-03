import React, { useEffect, useState } from "react";
import { ScanCard } from "../../ui/Cards";
import Pagination from "../../ui/Pagination";
import { useScans } from "../../hooks/useScans";
import SelectBox from "../../ui/SelectBox";
import { Scan } from "../../types";

export default function Scans() {
  const { scans, fetchScans } = useScans();
  const [paginationItems, setPaginationItems] = useState<Scan[]>([]);
  const [filteredValue, setFilteredValue] = useState(10);

  const filteredScans = (scans || []).filter((s: Scan) =>
    filteredValue === 10 || s.status === filteredValue ? s : null
  );

  useEffect(() => {
    (async () => {
      await fetchScans("/latest");
    })();
  }, []);

  if (!scans) {
    return <></>;
  }

  return (
    <div className="container py5">
      <div className="grid-filter mb3">
        <SelectBox
          filteredValue={filteredValue}
          setFilteredValue={setFilteredValue}
          initialValues={[10, 0, 2, 3]}
        />
      </div>
      <div className="scans">
        <div className="scans-hero stack">
          <div className="hero-title">
            <strong>Les scans </strong>
            de la communauté.
          </div>
          <div className="hero-text">
            Voici un aperçu des authentifications <br />
            de scans que notre équipes a pu effectuer.
          </div>
        </div>
        {paginationItems.map((s: Scan) => (
          <ScanCard
            key={s._id}
            scan={s}
          />
        ))}
      </div>
      <div className="scans-pagination">
        <Pagination
          items={filteredScans}
          itemsPerPage={50}
          totalItems={filteredScans.length}
          outOf={false}
          setPaginationItems={setPaginationItems}
        />
      </div>
    </div>
  );
}
