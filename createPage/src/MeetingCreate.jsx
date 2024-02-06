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
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [guideStep, setGuideStep] = useState(0);

    // 注意这里是 guideContent，上文中的 guideSteps 应为 guideContent
    const guideContent = [
        "Step 1: Enter the meeting name in the designated field.",
        "Step 2: Select the dates for your meeting using the calendar.",
        "Step 3: Enter the maximum number of collaborators.",
        "Step 4: Provide an email for meeting notifications.",
        "Step 5: Click 'Create Meeting' to finalize the meeting setup."
    ];

    const nextGuideStep = () => {
        if (guideStep < guideContent.length - 1) {
            setGuideStep(guideStep + 1);
        } else {
            setIsGuideVisible(false); // 关闭导览
            setGuideStep(0); // 重置导览步骤
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

    // 在这里添加 CSS-in-JS styles 对象，如之前定义的那样

    return (
        <div style={styles.centeredContainer}>
            <div style={styles.formContainer}>
                <button onClick={() => setIsGuideVisible(true)} style={styles.guideButton}>!</button>

                {isGuideVisible && (
                    <div style={styles.guideOverlay}>
                        <div style={styles.guideContent}>
                            <p>{guideContent[guideStep]}</p>
                            <button onClick={nextGuideStep} style={styles.nextButton}>
                                {guideStep < guideContent.length - 1 ? "➡️" : "Close"}
                            </button>
                        </div>
                    </div>
                )}

                <h2>Create a New Meeting</h2>
                <div style={styles.calendarWrapper}>
                    <Calendar multiple value={selectedDates} onChange={setSelectedDates} />
                </div>
                <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name" style={styles.input} />
                <input type="number" value={maxCollaborator} onChange={e => setMaxCollaborator(e.target.value)} placeholder="Max Collaborators" style={styles.input} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={styles.input} />
                <button onClick={handleSubmit} style={styles.button}>Create Meeting</button>
            </div>
        </div>
    );
}

// CSS in JS for component
// const styles = {
//     centeredContainer: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         width: '100vw',
//         textAlign: 'center', // Ensure text elements are centered
//     },
//     formContainer: {
//         padding: '20px',
//         maxWidth: '600px', // Maximum width of the form
//         width: '100%', // Use full width to ensure responsiveness
//         boxSizing: 'border-box', // Include padding and border in the element's total width
//     },
//     calendarWrapper: {
//         display: 'flex',
//         justifyContent: 'center',
//         width: '100%', // Adjust if necessary for your layout
//         margin: '0 auto 20px', // Margin bottom for spacing, auto for horizontal centering
//     },
//     input: {
//         display: 'block', // Ensure inputs are block-level elements for margin auto to work
//         margin: '10px auto', // Apply auto margin to horizontally center the elements
//         padding: '10px',
//         width: 'calc(100% - 20px)', // Adjust for padding
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         boxSizing: 'border-box',
//     },
//     button: {
//         display: 'block',
//         margin: '20px auto',
//         padding: '10px 20px',
//         border: 'none',
//         borderRadius: '4px',
//         backgroundColor: '#007BFF',
//         color: 'white',
//         cursor: 'pointer',
//         width: 'auto',
//     },
//     guideButton: {
//         // 添加导览按钮样式
//       },
//       guideOverlay: {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       guideContent: {
//         backgroundColor: '#fff',
//         padding: '20px',
//         borderRadius: '5px',
//       },
//       nextButton: {
//         marginTop: '10px',
//       }
// };
const styles = {
    centeredContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      textAlign: 'center', // 确保文本元素居中
    },
    formContainer: {
      padding: '20px',
      maxWidth: '600px', // 表单的最大宽度
      width: '100%', // 使用全宽以确保响应式
      boxSizing: 'border-box', // 包含内边距和边框在元素的总宽度中
      position: 'relative', // 为导览按钮设置相对定位的参考
    },
    calendarWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%', // 如有必要，调整布局
      margin: '0 auto 20px', // 底部边距用于间距，自动用于水平居中
    },
    input: {
      display: 'block', // 确保输入是块级元素，以便自动边距工作
      margin: '10px auto', // 应用自动边距以水平居中元素
      padding: '10px',
      width: 'calc(100% - 20px)', // 调整内边距
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
    guideButton: {
        position: 'absolute', // 使用绝对定位
        top: '20px', // 距离顶部20px
        left: '20px', // 距离左侧20px
        width: '40px', // 设置按钮宽度
        height: '40px', // 设置按钮高度，与宽度相等形成圆形
        padding: '5px', // 内边距
        fontSize: '24px', // 感叹号的字体大小
        lineHeight: '30px', // 用于垂直居中感叹号
        textAlign: 'center', // 文本居中对齐
        border: 'none', // 无边框
        borderRadius: '50%', // 边框半径50%形成圆形
        backgroundColor: '#add8e6', // 淡蓝色背景
        color: 'white', // 白色文本
        cursor: 'pointer', // 鼠标悬停时显示指针
        zIndex: 1050, // 确保按钮在其他元素之上
      },
    guideOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1040, // 高于页面上大多数元素
    },
    guideContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      width: '80%', // 导览内容宽度
      maxWidth: '400px', // 最大宽度限制
      textAlign: 'left', // 文本对齐方式
      position: 'relative', // 为导览内容内的按钮定位
    },
    nextButton: {
      display: 'inline-block',
      marginTop: '20px',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007BFF',
      color: 'white',
      cursor: 'pointer',
    }
  };
  
export default MeetingCreate;
