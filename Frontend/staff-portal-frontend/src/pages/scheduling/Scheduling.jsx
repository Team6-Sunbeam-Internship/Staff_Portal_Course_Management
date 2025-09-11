// src/pages/schedule/Scheduling.jsx

import React, { useState, useEffect } from 'react';
import ScheduleTable from '../../components/features/scheduling/components/Scheduling/ScheduleTable';
import Toast from '../../components/features/scheduling/components/Scheduling/Toast';

const Scheduling = () => {
  const [batch, setBatch] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skipDates, setSkipDates] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState(null);

  const allStaff = {
    'Course PG-DAC': ['Mahesh', 'Nilesh'],
    'Course B': ['Amit', 'Nitin'],
  };
  const groupOptions = ['ALL', 'D1', 'D2'];
  const moduleOptions = ['C++', 'Java', 'React'];
  const activityOptions = ['Lecture', 'Lab', 'Others'];
  const venueOptions = ['Lab 1', 'Lab 2', 'Classroom A', 'Classroom B', 'Seminar Hall'];

  useEffect(() => {
    if (course) {
      setStaffList(allStaff[course] || []);
    } else {
      setStaffList([]);
    }
  }, [course]);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  const handleSkipDateChange = (date) => {
    setSkipDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const addScheduleForDateRange = () => {
    if (!batch || !course || !startDate || !endDate) {
      showMessage('Please fill all required fields.', 'warning');
      return;
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    let newRows = [];

    while (sDate <= eDate) {
      const isoDate = sDate.toISOString().split('T')[0];

      if (
        !skipDates.includes(isoDate) &&
        new Date(isoDate) >= today &&
        !scheduleData.some(r => r.date === isoDate)
      ) {
        newRows.push({
          date: isoDate,
          startTime: '',
          endTime: '',
          staff: '',
          group: '',
          module: '',
          activity: '',
          venue: '',
          isEditing: true,
          isAdded: false,
        });
      }
      sDate.setDate(sDate.getDate() + 1);
    }

    if (newRows.length === 0) {
      showMessage('No new dates to add or all dates already exist.', 'warning');
      return;
    }

    setScheduleData(prev => [...prev, ...newRows]);
    showMessage(`${newRows.length} new row(s) added.`, 'success');
  };

  const handleCellChange = (index, field, value) => {
    const updated = [...scheduleData];
    updated[index][field] = value;
    setScheduleData(updated);
  };

  const handleAddRow = (index) => {
    const row = scheduleData[index];
    const newRow = {
      date: row.date,
      module: row.module,
      startTime: '',
      endTime: '',
      staff: '',
      group: '',
      activity: '',
      venue: '',
      isEditing: true,
      isAdded: false,
    };
    const updated = [...scheduleData];
    updated.splice(index + 1, 0, newRow);
    setScheduleData(updated);
  };

  const handleDeleteRow = (index) => {
    const updated = [...scheduleData];
    updated[index] = {
      ...updated[index],
      startTime: '',
      endTime: '',
      staff: '',
      group: '',
      module: '',
      activity: '',
      venue: '',
      isEditing: true,
      isAdded: false,
    };
    setScheduleData(updated);
    showMessage('Row cleared. To remove completely, exclude the date in skip dates.', 'info');
  };

  const handleSaveRow = (index) => {
    const row = scheduleData[index];
    if (
      !row.startTime ||
      !row.endTime ||
      !row.staff ||
      !row.group ||
      !row.module ||
      !row.activity ||
      !row.venue
    ) {
      showMessage('Please fill all fields including Venue.', 'warning');
      return;
    }
    const updated = [...scheduleData];
    updated[index] = { ...row, isEditing: false, isAdded: true };
    setScheduleData(updated);
    showMessage('Session saved.', 'success');
  };

  const handleUpdateRow = (index) => {
    const updated = [...scheduleData];
    updated[index].isEditing = true;
    setScheduleData(updated);
  };

  return (
    <div className="container-fluid p-3" style={{ maxWidth: 1320, margin: 'auto' }}>
      <h4 className="mb-3 text-center">Scheduling</h4>

      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-2">
          <label className="form-label mb-1">Batch <span className="text-danger">*</span></label>
          <select
            className="form-select form-select-sm"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            <option value="Cycle 1">Cycle 1</option>
            <option value="Cycle 2">Cycle 2</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Course <span className="text-danger">*</span></label>
          <select
            className="form-select form-select-sm"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            <option value="Course PG-DAC">PG-DAC</option>
            <option value="Course B">B</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Start Date <span className="text-danger">*</span></label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">End Date <span className="text-danger">*</span></label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Skip Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            onChange={(e) => {
              if (e.target.value) {
                handleSkipDateChange(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>

        <div className="col-md-2 d-grid">
          <button
            className="btn btn-success btn-sm"
            onClick={addScheduleForDateRange}
          >
            Add Schedule
          </button>
        </div>
      </div>

      {skipDates.length > 0 && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {skipDates.map((dt) => (
              <span key={dt} className="badge bg-danger d-flex align-items-center">
                {dt}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-1"
                  onClick={() => handleSkipDateChange(dt)}
                  title="Remove"
                  style={{ fontSize: '0.6rem' }}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginLeft: '10px', marginRight: '10px' }}>
        <ScheduleTable
          scheduleData={scheduleData}
          onAddRow={handleAddRow}
          onCellChange={handleCellChange}
          onDeleteRow={handleDeleteRow}
          onSaveRow={handleSaveRow}
          onUpdateRow={handleUpdateRow}
          staffList={staffList}
          moduleOptions={moduleOptions}
          groupOptions={groupOptions}
          activityOptions={activityOptions}
          venueOptions={venueOptions}
        />
      </div>

      <Toast
        message={message?.text}
        type={message?.type}
        onClose={() => setMessage(null)}
      />
    </div>
  );
};

export default Scheduling;
