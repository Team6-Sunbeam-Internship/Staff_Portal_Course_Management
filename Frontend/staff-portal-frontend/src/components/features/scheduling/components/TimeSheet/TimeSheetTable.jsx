// ==========================================
// ===== TimeSheetTable1.jsx =====
// src/components/timesheet/TimeSheetTable1.jsx

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TimeSheetTable({
  rows,
  onEdit,
  onDelete,
  getCourseName,
  getModuleName,
  getStaffName,
  getBatchCycleName,
  topics,
}) {
  console.log("Table received rows:", rows);
  
  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle mb-0">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Staff</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Assignment</th>
              <th>Extra Topic</th>
              <th>Topics</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => {
                console.log("Rendering row:", row);
                return (
                  <tr key={row.id}>
                    {/* Date */}
                    <td>
                      {row.logDate 
                        ? new Date(row.logDate).toLocaleDateString()
                        : row.date 
                        ? new Date(row.date).toLocaleDateString()
                        : <span className="text-muted">—</span>
                      }
                    </td>

                    {/* Staff */}
                    <td>
                      {row.staffName || 
                       (row.staffId && getStaffName ? getStaffName(row.staffId) : "") ||
                       <span className="text-muted">—</span>}
                    </td>

                    {/* Time */}
                    <td>
                      {row.startTime && row.endTime 
                        ? `${row.startTime} - ${row.endTime}`
                        : <span className="text-muted">—</span>
                      }
                    </td>

                    {/* Duration */}
                    <td>
                      {row.durationHours 
                        ? `${row.durationHours}h`
                        : row.hours 
                        ? `${row.hours}h`
                        : <span className="text-muted">—</span>
                      }
                    </td>

                    {/* Assignment */}
                    <td>
                      {row.assignment || <span className="text-muted">—</span>}
                    </td>

                    {/* Extra Topic */}
                    <td>
                      {row.extraTopic || <span className="text-muted">—</span>}
                    </td>

                    {/* Topics */}
                    <td>
                      {row.topicNames && row.topicNames.length > 0 ? (
                        <div>
                          {row.topicNames.map((topic, index) => (
                            <span key={index} className="badge bg-info text-dark me-1 mb-1">
                              {topic}
                            </span>
                          ))}
                        </div>
                      ) : row.timeSheetTopics && row.timeSheetTopics.length > 0 ? (
                        <div>
                          {row.timeSheetTopics.map((topic, index) => (
                            <span key={index} className="badge bg-info text-dark me-1 mb-1">
                              {topic.topicName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      {row.status ? (
                        <span className={`badge ${
                          row.status === 'COMPLETED' ? 'bg-success' :
                          row.status === 'IN_PROGRESS' ? 'bg-warning text-dark' :
                          row.status === 'APPROVED' ? 'bg-primary' :
                          row.status === 'REJECTED' ? 'bg-danger' :
                          'bg-secondary'
                        }`}>
                          {row.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <button
                        onClick={() => onEdit(row)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => onDelete(row.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted py-4">
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}