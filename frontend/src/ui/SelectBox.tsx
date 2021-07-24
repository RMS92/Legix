import React, { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { useToggle } from "../hooks/useToogle";
import { findStatusForSelect } from "../utils/functions";
import { useClickOutside } from "../hooks/useClickOutside";

export default function SelectBox({
  filteredValue,
  setFilteredValue,
  initialValues,
}: {
  filteredValue: number;
  setFilteredValue: Function;
  initialValues: number[];
}) {
  const { filteredValues } = useFilteredValues(initialValues);
  const [visible, setVisible] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setVisible(false));

  return (
    <div ref={ref}>
      <div className="grid-filter__group">
        <label htmlFor="filter-legit">Authenticité :</label>
        <div
          className="ts-control no-search single plugin-no_backspace_delete plugin-dropdown_input"
          onClick={() => setVisible(true)}
        >
          <div
            className={clsx(
              "items ts-input full has-items",
              visible ? " focus" : null
            )}
          >
            <div className="item" data-value="">
              {findStatusForSelect(filteredValue)}
            </div>
          </div>
          <div
            className="ts-dropdown single no-search plugin-no_backspace_delete plugin-dropdown_input"
            style={{ display: visible ? "block" : "none" }}
          >
            <div className="dropdown-input-wrap">
              <input
                className="dropdown-input"
                role="combobox"
                style={{ display: "none" }}
                hidden={true}
                aria-controls="filter-legit-ts-dropdown"
              />
            </div>
            <div className="ts-dropdown-content">
              {filteredValues.map((f) => (
                <div
                  key={f}
                  className={clsx(
                    "option",
                    f === filteredValue ? " active" : null
                  )}
                  role="option"
                  onClick={() => setFilteredValue(f)}
                >
                  {findStatusForSelect(f)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useFilteredValues(initial: number[]) {
  const [values, setValues] = useState(initial || []);

  return {
    filteredValues: values,
    addValue: useCallback(function (number) {
      setValues((state: number[]) => [...state, number]);
    }, []),
    deleteValue: useCallback(function (number) {
      setValues((state: number[]) => state.filter((n: number) => n !== number));
    }, []),
    resetValue: useCallback(function () {
      setValues([]);
    }, []),
  };
}
