import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory } from 'react-router-dom';
import * as api from './api/callapi';
import './MeetingCreate.css'; // 你的CSS文件路径
import "react-multi-date-picker/styles/layouts/mobile.css"; // 基础样式
// 根据需要导入日间或夜间模式样式
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

function MeetingCreate() {
    const history = useHistory();
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const matcher = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = ({ matches }) => setIsDarkMode(matches);
        matcher.addListener(onChange);
        return () => matcher.removeListener(onChange);
    }, []);
    const [meetingName, setMeetingName] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [maxCollaborator, setMaxCollaborator] = useState('');
    const [email, setEmail] = useState('');
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [guideStep, setGuideStep] = useState(0);

    const guideContent = [
        "Step 1: Enter the meeting name in the designated field.",
        "Step 2: Select the dates for your meeting using the calendar.",
        "Step 3: Enter the maximum number of collaborators.",
        "Step 4: Provide an email(Optional) for meeting notifications.",
        "Step 5: Click 'Create Meeting' to finalize the meeting setup."
    ];

    const nextGuideStep = () => {
        if (guideStep < guideContent.length - 1) {
            setGuideStep(guideStep + 1);
        } else {
            setIsGuideVisible(false);
            setGuideStep(0);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dateSelection = selectedDates.map(date => date.format('YYYY-MM-DD'));
        
        api.createTableApi(meetingName, dateSelection, 0, 24, maxCollaborator, email)
            .then(response => {
                history.push('/info', { meetingInfo: { meetingName, selectedDates: dateSelection, maxCollaborator, email, response } });
            })
            .catch(error => {
                console.error('Error creating meeting:', error);
                alert('Failed to create meeting.');
            });
    };

    return (
      <div className="centeredContainer">
        <div className="formContainer">
          <button onClick={() => setIsGuideVisible(true)} className="guideButton">?</button>
          {isGuideVisible && (
            <div className="guideOverlay">
              <div className="guideContent">
                <p>{guideContent[guideStep]}</p>
                <button onClick={nextGuideStep} className="nextButton">
                  {guideStep < guideContent.length - 1 ? "next" : "Close"}
                </button>
              </div>
            </div>
          )}

          <h2>Create a New Meeting</h2>
          <div className="calendarWrapper">
            <Calendar multiple value={selectedDates} onChange={setSelectedDates} />
          </div>
          <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name" className="input" />
          <input type="number" value={maxCollaborator} onChange={e => setMaxCollaborator(e.target.value)} placeholder="Max Collaborators" className="input" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Optional)" className="input" />
          <button onClick={handleSubmit} className="button">Create Meeting</button>
        </div>
      </div>
    );
}

export default MeetingCreate;
