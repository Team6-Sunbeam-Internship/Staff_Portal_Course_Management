// src/components/SchedulingTable/SchedulingTable.jsx

import React from "react";
import "./ScheduleTable.css";
import Select from "react-select";

const ScheduleTable1 = ({
  scheduleData,
  onAddRow,
  onCellChange,
  onDeleteRow,
  onRemoveRow,
  onSaveRow,
  onUpdateRow,
  staffList,
  moduleOptions,
  groupOptions,
  activityOptions,
  venueOptions,
  timeSlotOptions,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th style={{ width: "120px" }}>Time</th>
            <th>Slot</th>
            <th>Activity</th>
            <th style={{ width: "220px" }}>Staff</th>
            <th>Student Group</th>
            <th>Module</th>
            <th>Venue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((row, index) => (
            <tr key={index}>
              {/* Schedule Date */}
              <td>{row.scheduleDate}</td>

              {/* Start - End Time (two lines) */}
              <td>
                {row.isEditing ? (
                  <div className="d-flex flex-column align-items-center">
                    <input
                      type="time"
                      className="form-control form-control-sm mb-1"
                      value={row.startTime}
                      onChange={(e) =>
                        onCellChange(index, "startTime", e.target.value)
                      }
                    />
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={row.endTime}
                      onChange={(e) =>
                        onCellChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <div className="d-flex flex-column">
                    <span>{row.startTime || ""}</span> to
                    <span>{row.endTime || ""}</span>
                  </div>
                )}
                {row.isEditing && (
                  <i
                    className="bi bi-chevron-double-down text-success fs-6 ms-1"
                    role="button"
                    onClick={() => onAddRow(index)}
                    title="Add Row"
                  ></i>
                )}
              </td>

              {/* Time Slot */}
              <td>
                {row.isEditing ? (
                  <select
                    className="form-select form-select-sm no-arrow"
                    value={row.slotName}
                    onChange={(e) =>
                      onCellChange(index, "slotName", e.target.value)
                    }
                  >
                    <option value="">Select Slot</option>
                    {timeSlotOptions.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                ) : (
                  row.slotName
                )}
              </td>

              {/* Activity */}
              <td>
                {row.isEditing ? (
                  <select
                    className="form-select form-select-sm no-arrow"
                    value={row.activity}
                    onChange={(e) =>
                      onCellChange(index, "activity", e.target.value)
                    }
                  >
                    <option value="">Select Activity</option>
                    {activityOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  row.activity
                )}
              </td>

              {/* Staff */}
              <td>
                {row.isEditing ? (
                  <Select
                    isMulti
                    options={staffList.map((name) => ({
                      value: name,
                      label: name,
                    }))}
                    value={
                      Array.isArray(row.staffNames)
                        ? row.staffNames.map((name) => ({
                            value: name,
                            label: name,
                          }))
                        : []
                    }
                    onChange={(selected) => {
                      const updatedStaff = selected
                        ? selected.map((s) => s.value)
                        : [];
                      onCellChange(index, "staffNames", updatedStaff);
                    }}
                    placeholder="Select Staff"
                    classNamePrefix="react-select"
                    styles={{
                      multiValue: (base) => ({
                        ...base,
                        fontSize: "13px",
                        padding: "2px 4px",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        fontSize: "10px",
                        padding: "0 2px",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: "0 4px",
                      }),
                      clearIndicator: (base) => ({
                        ...base,
                        padding: "0 4px",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        maxHeight: "60px",
                        overflowY: "auto",
                      }),
                    }}
                  />
                ) : (
                  row.staffNames?.join(", ")
                )}
              </td>

              {/* Student Groups */}
              <td>
                {row.isEditing ? (
                  <Select
                    isMulti
                    options={[
                      { value: "All", label: "All" },
                      ...groupOptions.map((g) => ({ value: g, label: g })),
                    ]}
                    value={
                      Array.isArray(row.studentGroups)
                        ? row.studentGroups.map((g) => ({
                            value: g,
                            label: g,
                          }))
                        : []
                    }
                    onChange={(selected) => {
                      let updatedGroups = selected
                        ? selected.map((s) => s.value)
                        : [];
                      if (updatedGroups.includes("All")) {
                        updatedGroups = ["All"];
                      }
                      onCellChange(index, "studentGroups", updatedGroups);
                    }}
                    placeholder="Select Groups"
                    classNamePrefix="react-select"
                    styles={{
                      multiValue: (base) => ({
                        ...base,
                        fontSize: "13px",
                        padding: "2px 4px",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        fontSize: "10px",
                        padding: "0 2px",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: "0 4px",
                      }),
                      clearIndicator: (base) => ({
                        ...base,
                        padding: "0 4px",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        maxHeight: "60px",
                        overflowY: "auto",
                      }),
                    }}
                  />
                ) : (
                  row.studentGroups?.join(", ")
                )}
              </td>

              {/* Module */}
              <td>
                {row.isEditing ? (
                  <select
                    className="form-select form-select-sm no-arrow"
                    value={row.moduleName}
                    onChange={(e) =>
                      onCellChange(index, "moduleName", e.target.value)
                    }
                  >
                    <option value="">Select Module</option>
                    {moduleOptions.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  row.moduleName
                )}
              </td>

              {/* Venue */}
              <td>
                {row.isEditing ? (
                  <select
                    className="form-select form-select-sm no-arrow"
                    value={row.infrastructureName}
                    onChange={(e) =>
                      onCellChange(index, "infrastructureName", e.target.value)
                    }
                  >
                    <option value="">Select Venue</option>
                    {venueOptions.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                ) : (
                  row.infrastructureName
                )}
              </td>

              {/* Actions */}
              <td>
                {row.isEditing ? (
                  <>
                    <i
                      className="bi bi-check-circle-fill text-success fs-5"
                      role="button"
                      onClick={() => onSaveRow(index)}
                      title="Save Row"
                    />
                  </>
                ) : (
                  <>
                    {row.editable && (
                      <i
                        className="bi bi-pencil text-warning fs-5"
                        role="button"
                        onClick={() => onUpdateRow(index)}
                        title="Edit Row"
                      />
                    )}
                  </>
                )}
                <i
                  className="bi bi-trash-fill text-info fs-5 ms-2"
                  role="button"
                  onClick={() => onDeleteRow(index)}
                  title="Delete Row"
                />
                <i
                  className="bi bi-x-circle text-danger fs-5 ms-2"
                  role="button"
                  onClick={() => onRemoveRow(index)}
                  title="Remove Row (UI only)"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable1;
