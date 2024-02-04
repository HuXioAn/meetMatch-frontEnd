import React, { useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory } from 'react-router-dom';
import * as api from './api/callapi.js';
//import { useNavigate } from 'react-router-dom';



function MeetingCreate() {
    //const navigate = useNavigate();
    const [meetingName, setMeetingName] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [maxCollaborator, setMaxCollaborator] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory(); // 使用 useHistory 钩子

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dateSelection = selectedDates.map(date => date.format('YYYY-MM-DD'));
        // Create an object to store meeting information
        const meetingInfo = {
            meetingName,
            selectedDates: dateSelection,
            maxCollaborator,
            email,
            response : null
            // Add any other relevant fields here
        };
        
        api.createTableApi(meetingName, dateSelection, 0, 24, maxCollaborator, email)
            .then(response => {
                console.log('Meeting created successfully!' + JSON.stringify(response));
                //navigate('/Info', { state: { /* 传递的会议信息 */ } });
                meetingInfo.response = response
                history.push('/Info', { meetingInfo });
            })
            .catch(error => {
                alert('Failed to create meeting.');
            });
    };

    return (
        <div style={styles.container}>
            <h2>Create a New Meeting</h2>
            <div style={styles.calendarContainer}>
                <Calendar
                    multiple
                    value={selectedDates}
                    onChange={setSelectedDates}
                />
            </div>
            <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="Meeting Name"
                style={styles.input}
            />
            <input
                type="number"
                value={maxCollaborator}
                onChange={(e) => setMaxCollaborator(e.target.value)}
                placeholder="Max Collaborators"
                style={styles.input}
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={styles.input}
            />
            <button onClick={handleSubmit} style={styles.button} className="submitButton">Create Meeting</button>
        </div>
    );
}

// Update CSS styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
    calendarContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%', 
        marginBottom: '20px',
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        marginTop: '20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
    },
};

export default MeetingCreate;
