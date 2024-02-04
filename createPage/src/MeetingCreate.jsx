import React, { useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory } from 'react-router-dom';
import * as api from './api/callapi'; // 确保路径正确

function MeetingCreate() {
    const history = useHistory();
    const [meetingName, setMeetingName] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [maxCollaborator, setMaxCollaborator] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dateSelection = selectedDates.map(date => date.format('YYYY-MM-DD'));
        api.createTableApi(meetingName, dateSelection, 0, 24, maxCollaborator, email)
            .then(response => {
                history.push('/info', { meetingInfo: { meetingName, dateSelection, maxCollaborator, email, response } });
            })
            .catch(error => {
                console.error('Error creating meeting:', error);
                alert('Failed to create meeting.');
            });
    };

    return (
        <div style={styles.centeredContainer}>
            <div style={styles.formContainer}>
                <h2>Create a New Meeting</h2>
                <div style={styles.calendarWrapper}>
                    <Calendar
                        multiple
                        value={selectedDates}
                        onChange={setSelectedDates}
                    />
                </div>
                <input
                    type="text"
                    value={meetingName}
                    onChange={e => setMeetingName(e.target.value)}
                    placeholder="Meeting Name"
                    style={styles.input}
                />
                <input
                    type="number"
                    value={maxCollaborator}
                    onChange={e => setMaxCollaborator(e.target.value)}
                    placeholder="Max Collaborators"
                    style={styles.input}
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    style={styles.input}
                />
                <button onClick={handleSubmit} style={styles.button}>Create Meeting</button>
            </div>
        </div>
    );
}

// CSS in JS for component
const styles = {
    centeredContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        textAlign: 'center', // Ensure text elements are centered
    },
    formContainer: {
        padding: '20px',
        maxWidth: '600px', // Maximum width of the form
        width: '100%', // Use full width to ensure responsiveness
        boxSizing: 'border-box', // Include padding and border in the element's total width
    },
    calendarWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%', // Adjust if necessary for your layout
        margin: '0 auto 20px', // Margin bottom for spacing, auto for horizontal centering
    },
    input: {
        display: 'block', // Ensure inputs are block-level elements for margin auto to work
        margin: '10px auto', // Apply auto margin to horizontally center the elements
        padding: '10px',
        width: 'calc(100% - 20px)', // Adjust for padding
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    button: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        width: 'auto',
    },
};

export default MeetingCreate;
