import React from "react";

export default function SessionTable({ sessions, onEdit, onDelete }) {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Title</th>
            <th>Meeting ID</th>
            <th>Credentials</th>
            <th>Staff</th>
            <th>Status</th>
            <th>Description</th>
            <th>Codeshare Token</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center text-muted">
                No sessions available
              </td>
            </tr>
          ) : (
            sessions.map((session, index) => (
              <tr key={index}>
                <td>{new Date(session.sessionDate).toLocaleDateString()}</td>
                <td>{`${session.startTime} - ${session.endTime}`}</td>
                <td>{session.title}</td>
                <td>{session.meetingId}</td>
                <td>{session.meetingCredentials}</td>
                <td>{session.staffName}</td>
                <td>
                  <span
                    className={`badge ${
                      session.status === "Completed"
                        ? "bg-success"
                        : session.status === "In Progress"
                        ? "bg-warning"
                        : session.status === "Cancelled"
                        ? "bg-danger"
                        : "bg-primary"
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td>
                  {session.description?.length > 50
                    ? session.description.substring(0, 50) + "..."
                    : session.description}
                </td>
                <td>{session.codeShareToken}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-primary"
                      onClick={() => onEdit(session)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
