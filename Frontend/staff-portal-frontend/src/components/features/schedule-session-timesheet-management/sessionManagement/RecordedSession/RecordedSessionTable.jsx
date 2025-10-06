import React, { useState } from "react";

const RecordedSessionTable = ({ rows, onEdit, onDelete }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleUrlClick = (session) => {
    if (session.url) {
      setSelectedVideo(session);
      setShowVideoModal(true);
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.webm', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') ||
           url.includes('vimeo.com') ||
           url.includes('drive.google.com');
  };

  const getEmbedUrl = (url) => {
    if (!url) return url;
    
    // YouTube URL conversion
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo URL conversion
    else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url; // Return original URL for direct video files
  };

  if (rows.length === 0) {
    return (
      <div className="text-center mt-4">
        <div className="alert alert-info">
          <h5>No Recorded Sessions Found</h5>
          <p className="mb-0">Use the filters above to search for recorded sessions or add a new session.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Channel</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">URL</th>
              <th scope="col">Course</th>
              <th scope="col">Batch Cycle</th>
              <th scope="col">Staff Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{formatDate(row.sessionDate)}</td>
                <td>
                  <span className="badge bg-info">{row.channel}</span>
                </td>
                <td>
                  <strong>{truncateText(row.title, 30)}</strong>
                </td>
                <td>
                  <small className="text-muted">
                    {truncateText(row.description, 40)}
                  </small>
                </td>
                <td>
                  {row.url ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleUrlClick(row)}
                      title="Play Recording"
                    >
                      Play Video
                    </button>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <span className="badge bg-secondary">{row.courseName}</span>
                </td>
                <td>
                  <span className="badge bg-primary">{row.batchCycleName}</span>
                </td>
                <td>{row.staffName}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => onEdit(row)}
                      title="Edit Session"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(row.id)}
                      title="Delete Session"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Video Player Modal */}
      {showVideoModal && selectedVideo && (
        <div className="modal d-block" style={{ 
          background: "rgba(0,0,0,0.8)", 
          zIndex: 1050 
        }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedVideo.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeVideoModal}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  {isVideoUrl(selectedVideo.url) ? (
                    selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be') || selectedVideo.url.includes('vimeo.com') ? (
                      <iframe
                        src={getEmbedUrl(selectedVideo.url)}
                        title={selectedVideo.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <video
                        controls
                        autoPlay={false}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <source src={selectedVideo.url} type="video/mp4" />
                        <source src={selectedVideo.url} type="video/webm" />
                        <source src={selectedVideo.url} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <div className="text-center">
                        <h6>Cannot play this media type</h6>
                        <p className="text-muted">This URL may not be a supported video format.</p>
                        <a 
                          href={selectedVideo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Open in New Tab
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <div className="text-start flex-grow-1">
                  <small className="text-muted">
                    <strong>Channel:</strong> {selectedVideo.channel} | 
                    <strong> Date:</strong> {formatDate(selectedVideo.sessionDate)} | 
                    <strong> Staff:</strong> {selectedVideo.staffName}
                  </small>
                  {selectedVideo.description && (
                    <div className="mt-1">
                      <small className="text-muted">
                        <strong>Description:</strong> {selectedVideo.description}
                      </small>
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeVideoModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecordedSessionTable;