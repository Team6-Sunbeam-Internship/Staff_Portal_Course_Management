import React from "react";

const ScheduleTable = ({
  scheduleData,
  onCellChange,
  onAddRow,
  onDeleteRow,
  onSaveRow,
  onUpdateRow,
  staffList,
  moduleOptions,
  groupOptions,
  activityOptions,
  venueOptions,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Time Slot (Start - End)</th>
            <th>Staff Name</th>
            <th>Group</th>
            <th>Module</th>
            <th>Activity</th>
            <th>Venue</th> 
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No schedule data available.</td>
            </tr>
          ) : (
            scheduleData.map((row, index) => {
              const isEditable = row.isEditing;

              return (
                <tr key={index}>
                  {/* Date */}
                  <td>{row.date}</td>

                  {/* Time Slot */}
                  <td style={{ minWidth: "220px" }}>
                    {isEditable ? (
                      <div className="d-flex align-items-center">
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          style={{ minWidth: "100px" }}
                          value={row.startTime}
                          onChange={(e) => onCellChange(index, "startTime", e.target.value)}
                        />
                        <span> - </span>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          style={{ minWidth: "100px" }}
                          value={row.endTime}
                          onChange={(e) => onCellChange(index, "endTime", e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>{row.startTime} - {row.endTime}</div>
                    )}
                    <div className="d-flex align-items-center mt-1">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Add new session below"
                        onClick={() => onAddRow(index)}
                      >
                        Add Session
                      </button>
                    </div>
                  </td>

                  {/* Staff */}
                  <td>
                    {isEditable ? (
                      <select
                        className="form-select form-select-sm"
                        value={row.staff}
                        onChange={(e) => onCellChange(index, "staff", e.target.value)}
                      >
                        <option value="">Select Staff</option>
                        {staffList.map((staff, i) => (
                          <option key={i} value={staff}>{staff}</option>
                        ))}
                      </select>
                    ) : row.staff}
                  </td>

                  {/* Group */}
                  <td>
                    {isEditable ? (
                      <select
                        className="form-select form-select-sm"
                        value={row.group}
                        onChange={(e) => onCellChange(index, "group", e.target.value)}
                      >
                        <option value="">Select Group</option>
                        {groupOptions.map((grp, i) => (
                          <option key={i} value={grp}>{grp}</option>
                        ))}
                      </select>
                    ) : row.group}
                  </td>

                  {/* Module */}
                  <td>
                    {isEditable ? (
                      <select
                        className="form-select form-select-sm"
                        value={row.module}
                        onChange={(e) => onCellChange(index, "module", e.target.value)}
                      >
                        <option value="">Select Module</option>
                        {moduleOptions.map((mod, i) => (
                          <option key={i} value={mod}>{mod}</option>
                        ))}
                      </select>
                    ) : row.module}
                  </td>

                  {/* Activity */}
                  <td>
                    {isEditable ? (
                      <select
                        className="form-select form-select-sm "
                        value={row.activity}
                        onChange={(e) => onCellChange(index, "activity", e.target.value)}
                      >
                        <option value="">Select Activity</option>
                        {activityOptions.map((act, i) => (
                          <option key={i} value={act}>{act}</option>
                        ))}
                      </select>
                    ) : row.activity}
                  </td>

                 
                  <td>
  {isEditable ? (
    <select
      className="form-select form-select-sm"
      value={row.venue}
      onChange={(e) => onCellChange(index, "venue", e.target.value)}
    >
      <option value="">Select Venue</option>
      {venueOptions.map((venue, i) => (
        <option key={i} value={venue}>
          {venue}
        </option>
      ))}
    </select>
  ) : (
    row.venue || "-"
  )}
</td>

                  {/* Actions */}
                  <td>
                    {isEditable ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={() => onSaveRow(index)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDeleteRow(index)}
                        >
                          Clear
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => onUpdateRow(index)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDeleteRow(index)}
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
