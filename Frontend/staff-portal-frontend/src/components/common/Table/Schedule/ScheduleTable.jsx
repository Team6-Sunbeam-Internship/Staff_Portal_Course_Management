// src/components/SchedulingTable/SchedulingTable.jsx

import React from "react";
import "./ScheduleTable.css";


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
            <th>Time</th>
            <th>Slot</th>
            <th>Activity</th>
            <th>Staff</th>
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

              {/* Start - End Time in one column */}
              <td>
                {row.isEditing ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <input
                      type="time"
                      className="form-control form-control-sm me-1"
                      value={row.startTime}
                      onChange={(e) =>
                        onCellChange(index, "startTime", e.target.value)
                      }
                    />
                    -
                    <input
                      type="time"
                      className="form-control form-control-sm ms-1 w-auto"
                      value={row.endTime}
                      onChange={(e) =>
                        onCellChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  `${row.startTime || ""} - ${row.endTime || ""}`

                )}
                {row.isEditing && (<i
                  className="bi bi-chevron-double-down text-success fs-5 ms-2"
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
                  <div className="dropdown w-100">
                    <button
                      className="btn btn-sm btn-outline-body w-100 text-start"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {row.staffNames?.length > 0
                        ? row.staffNames.join(", ")
                        : "Select Staff"}
                    </button>
                    <ul
                      className="dropdown-menu p-2 col-3"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {staffList.map((name, i) => (
                        <li key={i}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={row.staffNames.includes(name)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...row.staffNames, name]
                                  : row.staffNames.filter((n) => n !== name);
                                onCellChange(index, "staffNames", updated);
                              }}
                            />
                            <label className="form-check-label">{name}</label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  row.staffNames?.join(", ")
                )}
              </td>

              {/* Student Groups */}

              <td>
                {row.isEditing ? (
                  <div className="dropdown w-100">
                    <button
                      className="btn btn-sm btn-outline-body w-100 text-start"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {row.studentGroups?.length > 0
                        ? row.studentGroups.join(", ")
                        : "Select Groups"}
                    </button>
                    <ul
                      className="dropdown-menu p-2 col-3"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {/* === "All" OPTION === */}
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={row.studentGroups?.includes("All")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Only keep "All"
                                onCellChange(index, "studentGroups", ["All"]);
                              } else {
                                // Uncheck → clear selection
                                onCellChange(index, "studentGroups", []);
                              }
                            }}
                          />
                          <label className="form-check-label">All</label>
                        </div>
                      </li>

                      {/* === INDIVIDUAL GROUP OPTIONS === */}
                      {groupOptions.map((g, i) => (
                        <li key={i}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={row.studentGroups?.includes(g)}
                              disabled={row.studentGroups?.includes("All")} // disable when "All" is selected
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...row.studentGroups.filter((n) => n !== "All"), g]
                                  : row.studentGroups.filter((n) => n !== g);
                                onCellChange(index, "studentGroups", updated);
                              }}
                            />
                            <label className="form-check-label">{g}</label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                {/* New Remove (UI only) */}
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
