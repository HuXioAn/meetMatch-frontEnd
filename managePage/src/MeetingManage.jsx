import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory, useLocation } from 'react-router-dom';
import * as api from './api/callapi';
import './MeetingManage.css';
import dayjs from 'dayjs';

function MeetingManage() {
  const history = useHistory();
  const location = useLocation();

  const [meetingName, setMeetingName] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [maxCollaborator, setMaxCollaborator] = useState('');
  const [email, setEmail] = useState('');
  const [mToken, setMToken] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mTokenFromUrl = params.get('mToken');
    if (mTokenFromUrl) {
      setMToken(mTokenFromUrl);
      const vToken = "v" + mTokenFromUrl.substring(1, 17);

      api.visitTableApi(vToken).then(data => {
        if (data && data.dateSelection) {
          const sortedDates = data.dateSelection.map(dateStr => new Date(dateStr))
                                .sort((a, b) => a - b);
          setMeetingName(data.meetingName || '');
          setSelectedDates(sortedDates);
          setMaxCollaborator(data.maxCollaborator || '');
          setEmail(data.email || '');
        }
      }).catch(error => {
        console.error('Error fetching meeting data:', error);
      });
    }
  }, [location.search]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const dateSelection = selectedDates.map(date => dayjs(date).format('YYYY-MM-DD'));

    api.manageTableApi(mToken, meetingName, dateSelection, 0, 24, maxCollaborator, email)
      .then(response => {
        history.push('/info', { meetingInfo: { meetingName, selectedDates: dateSelection, maxCollaborator, email, response } });
      })
      .catch(error => {
        console.error('Error updating meeting:', error);
        alert('Failed to update meeting.');
      });
  };

  const handleDateChange = (dates) => {
    const sortedDates = [...dates].sort((a, b) => a - b);
    setSelectedDates(sortedDates);
  };

  const handleDeleteConfirm = async () => {
    api.deleteTableApi(mToken)
      .then(() => {
        window.location.href = 'https://meetmatch.us';
      })
      .catch(error => {
        console.error('Error deleting meeting:', error);
        alert('Failed to delete meeting.');
      });
  };

  return (
    <div className="centeredContainer">
      <div className="formContainer">
        <h2>Manage Meeting</h2>
        <div className="calendarWrapper">
          <Calendar multiple value={[...selectedDates]} onChange={handleDateChange} />
        </div>
        <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name" className="input" />
        <input type="number" value={maxCollaborator} onChange={e => setMaxCollaborator(e.target.value)} placeholder="Max Collaborators" className="input" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Optional)" className="input" />
        <div className="buttonContainer">
          <button onClick={handleUpdate} className="button">Submit</button>
          <button onClick={() => setShowConfirmDialog(true)} className="button deleteButton">Delete</button>
        </div>
        {showConfirmDialog && (
          <div className="guideOverlay">
            <div className="guideContent">
              <p>Are you sure you want to delete this meeting?</p>
              <div className="buttonContainer">
                <button onClick={handleDeleteConfirm} className="button deleteButton">Yes</button>
                <button onClick={() => setShowConfirmDialog(false)} className="button">No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingManage;
