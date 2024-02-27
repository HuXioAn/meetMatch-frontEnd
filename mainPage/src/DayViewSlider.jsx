import React from 'react';
// import dayjs from 'dayjs';
// import './DayViewSlider.css';
// import { Calendar } from '@douyinfe/semi-ui';
import * as api from './callapi.js';
// import moment from 'moment';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Switch from "react-switch";
// import '@fullcalendar/daygrid/main.css'
// import momentTimezonePlugin from '@fullcalendar/moment-timezone'
// import { Alert } from 'antd';
import './DayViewSlider.css'

let eventGuid = 0
let BGcolorFlag = 0
let RandomBGclolr = '#ffffff'
export var Vtoken = ''    //to be determined
// const CurrentUrl = window.location.href;


export class DayViewSlider extends React.Component{

  BGcolorFlag = 0;
  constructor(props) {
    super(props);
    this.state = {
      currentEvents: [],      //本地新创建的事件
      RevEvents: [],          //API收取的事件
      RealTimeEvents: [],     //时间转换完用于统计结果
      meetingNames:'',
      dateSelections:'',      //API收取的时间选择，可能为不连续，来替代前台header的显示
      DateWithoutTime:'',
      DateNum:'',
      isLoading: true,
      isGuideVisible: false,
      guideStep: 0,
      displayAsBackground: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  ///////////////////////////////////switch

  handleChange(checked) {
    const updatedEvents = this.state.RevEvents.map(event => ({
      ...event,
      display: checked ? 'background' : 'block'
    }));

    this.setState({ RevEvents: updatedEvents, displayAsBackground: checked });

  }

  ////////////////////////////////////////////////calendar guide

  setIsGuideVisible = (isGuideVisible) => {
    this.setState({isGuideVisible});
  }

  setGuideStep = (guideStep) => {
    this.setState({guideStep});
  }

  guideContent = [
    "Step 1: Please note the light green optional area, these are the optional timeslots for the meeting.",
    "Step 2: Long press and drag to select time.",
    "Step 3: Click on the timeslot you have selected if you want to delete your selection.",
    "Step 4: Click the switch to change the events format. It can be in selection mode or view mode. ",
    "Step 5: Click the 'SUBMIT' button on the top right to submit your choice."
  ];

  nextGuideStep = () => {
    if (this.state.guideStep < this.guideContent.length - 1) {
      this.setGuideStep(this.state.guideStep + 1);
    } else {
      this.setIsGuideVisible(false); // 关闭导览
      this.setGuideStep(0); // 重置导览步骤
    }
  };

  //////////////////////////////////////////////calendar initial

  componentDidMount(){
    //  this.TokenFetch();
     this.InitialTimeTableFetch()
     console.log('check rev', this.state.RevEvents)
  }

  InitialTimeTableFetch = async () => {
    // console.log('table fetch');
    // console.log(Vtoken);
    try{
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const searchParams = new URLSearchParams(urlObj.search);
    const tokenFromUrl = await searchParams.get('vToken');
    
    if (tokenFromUrl) {
      Vtoken = await tokenFromUrl;
      this.setState({ token: tokenFromUrl }, () => {
        console.log(Vtoken);
      });
    } else {
      console.log('No token found in URL');
    }
      const data = await api.visitTableApi(Vtoken)
      console.log('Data received:', data);
      const existingSelection = data.existingSelection;
      const RevmeetingNames = [];
      const RevdateSelections = [];
      const RevtimeRanges = [];
      // let colors = existingSelection.map(selection => selection.color);
      // let startTimes = existingSelection.flatMap(selection => selection.slots.map(slot => slot.startTime));
      // let endTimes = existingSelection.flatMap(selection => selection.slots.map(slot => slot.endTime));

      RevtimeRanges.push(data.timeRange);
      RevmeetingNames.push(data.meetingName);
      Array.prototype.push.apply(RevdateSelections, data.dateSelection);

      // const backgroundEvents = RevdateSelections.map((date) => {
      //   const dateWithoutTime = date.replace('T00:00:00', '');
      //   return{
      //     id: this.createEventId(),
      //     title: ' ', 
      //     editable: false,
      //     selectable: false,
      //     start: date,
      //     end: dateWithoutTime +'T23:59:59',
      //     display: 'background',
      //     backgroundColor: '#67e66763',
      //     borderColor: '#67e66763'
      //   }
      // });

      const WithoutTimes = data.dateSelection.map((date) => {
        return date.replace('T00:00:00', '');
      });

      const dateNum = WithoutTimes.length;

      console.log('initialevents:',this.state.RevEvents,'  dateNum:',this.state.DateNum);

      var newEvents = [];
      var eventnum = existingSelection.length;
      while (eventnum>0){
        var slotnum = existingSelection[eventnum-1].slots.length;
        while(slotnum>0){
          newEvents.push({
            id: this.createEventId(),
            title: ' ', 
            editable: false,
            selectable: false,
            display: 'block',
            start: existingSelection[eventnum-1].slots[slotnum-1].startTime,
            end: existingSelection[eventnum-1].slots[slotnum-1].endTime,
            backgroundColor: existingSelection[eventnum-1].color,
            borderColor: existingSelection[eventnum-1].color
          });
          slotnum--;
        }
        eventnum--;
      }
      console.log('newevents', newEvents);

      // const combinedEvents = backgroundEvents.concat(newEvents);
      // 只显示对应天数后，没有必要再使用背景色显示，只显示提交的事件

      this.setState({ 
        RevEvents: newEvents,
        dateSelections: RevdateSelections,
        meetingNames: RevmeetingNames,
        DateWithoutTime: WithoutTimes,
        DateNum: dateNum,
        isLoading: false
       });

       
    } catch(error) {
      console.error("Error fetching table results:", error);
      this.setState({ isLoading: false });
    }
  };

  //////////////////////////////////////////////////////////calendar submit

  SubmitTimeTable = async (event) => {

    event.preventDefault();
    var eventnum = this.state.currentEvents.length;
    let refcolor = this.state.currentEvents[eventnum-1].backgroundColor;
    let starttime = [];
    let endtime = [];
    let color = '';

    if(this.state.currentEvents[eventnum-1].extendedProps.selectable == false){
      alert("[!]Select something!")
      return null;
    }

    while (eventnum>0){
      console.log('this.state.currentEvents[eventnum-1].extendedProps.selectable:',this.state.currentEvents[eventnum-1].extendedProps.selectable);
      if(this.state.currentEvents[eventnum-1].extendedProps.selectable == true){
        console.log('events:',eventnum);
        starttime.push(this.state.currentEvents[eventnum-1].startStr);
        endtime.push(this.state.currentEvents[eventnum-1].endStr);
      }
      eventnum--;
    }
    color = refcolor;
    const timeslot = starttime.map((starttime, index) => ({
      'startTime': starttime,
      'endTime': endtime[index],
    }));

    // console.log('color:',color);
    // console.log('timeslot:',timeslot);
    api.updateTableApi(Vtoken,color,timeslot).then(reply => {
      if(reply.state == 0){
        alert("Submit successfully!")
        location.reload()
      }else{
        alert("[!]Sorry, failed!")
      }
      
    }).catch(err => {
      alert("[!]Error submitting: " + err)
    })
  }

  ////////////////////////////////////////////////////////////calendar operation

  SwipeTime = (selectInfo) => {
    let title = ' '
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    const newEvent = {
          id: this.createEventId(), // 创建一个新的唯一ID
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          backgroundColor: GenerateRandomColor(), // 假设这是一个返回随机颜色的方法
          borderColor: GenerateRandomColor(),
          editable: true,
          selectable: true
        };
    calendarApi.addEvent(newEvent);
    console.log(calendarApi);
  }

  handleEvents = (events) => {
    // console.log('Current events:', events);
    this.setState({
      currentEvents: events
    })
    console.log(this.state.currentEvents)
  }

  GetCurrentTime = () => {
    const currentTime = new Date().toLocaleTimeString();
   return (currentTime);
  }

  handleEventClick = (clickInfo) => {
    console.log('clickInfo.event.editable:',clickInfo.event.extendedProps.selectable);
    // console.log('clickInfo.event:',clickInfo.event);
    if (clickInfo.event.extendedProps.selectable == true){
      if (confirm(`Are you sure you want to delete the event?`)) {
        clickInfo.event.remove()
      }
    }
    
  }

  renderEventContent(eventInfo) {
    return (
      <>
        <p>{eventInfo.timeText}</p>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  createEventId = () => {
    return String(eventGuid++)
  }

  handleDateClick = (arg) => {
        alert(arg.dateStr)
  }

  dayHeaderChange = (headerInfo) => {
    const actualDate = headerInfo.date;
    const dateList = this.state.DateWithoutTime;
    const dateNum = this.state.DateNum;
    const index = Math.floor((actualDate - new Date(dateList[0])) / (1000 * 60 * 60 * 24))+1;

    if (index >= 0 && index < dateNum) {
      const displayDate = dateList[index];
      if (displayDate) {
        return `${new Date(displayDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'numeric',
          day: 'numeric'
        })}`;
      }
    }

    return actualDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric'
    });
  }

  setVisibleRange = () =>{
    const startDate = new Date(this.state.DateWithoutTime[0]);
    const endDate = new Date(startDate); 
    endDate.setDate(startDate.getDate() + this.state.DateNum); 
  
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  }

  eventAllow = (dropInfo, draggedEvent) => {
    console.log('draggedEvent.extendedProps.editable:',draggedEvent.extendedProps.selectable);
    // console.log('draggedEvent.extendedProps:',draggedEvent.extendedProps);
    // console.log('draggedEvent:',draggedEvent);
    if (!draggedEvent.extendedProps.selectable) {
      return false;
    }
    return true;
  }

  dateViewToReal = () => {


  }

  render(){
    const { isLoading } = this.state;
    if (isLoading){
        return <div style={{
            textAlign:'center',
            justifyContent: 'center',
            alignItems: 'center'
        }}>Loading...</div>;
    }
      return (
      <div
        style={{
          display:'flex',
          flexDirection: "column"
        }}>
          <div style={{
              display:'flex',
              flexDirection: 'row',
            }}>
            <div style={{
              display:'flex',
              height:'5vh',
              width:'70vw',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',

            }}>
              <div style={{
                display:'flex',
                width:'10vw',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '25px',
                marginLeft: '10px'
                }}>
                <button onClick={() => this.setIsGuideVisible(true)} style={styles.guideButton}>!</button>
                  {this.state.isGuideVisible && (
                      <div style={styles.guideOverlay}>
                          <div style={styles.guideContent}>
                              <p>{this.guideContent[this.state.guideStep]}</p>
                              <button onClick={this.nextGuideStep} style={styles.nextButton}>
                                  {this.state.guideStep < this.guideContent.length - 1 ? "➡️" : "Close"}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
              <div style={{
                display:'flex',
                width:'50vw',
                justifyContent: 'flex-start', 
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: '25px'
                }}>
                <div style={{marginLeft:'10vw'}}>
                  <h3>{this.state.meetingNames}</h3>
                </div>
              </div>
              <div style={{
                display:'flex',
                width:'10vw',
                justifyContent: 'flex-start', 
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: '25px'
                }}>
                  <Switch 
                    onChange={this.handleChange} 
                    // checked={this.state.checked} 
                    checked={this.state.displayAsBackground}
                    uncheckedIcon = {false}
                    checkedIcon = {false}
                    // offColor = {'#'}
                    onColor = {'#007bff'}
                  />
              </div>
            </div> 
            
            <div style={{
              display:'flex',
              width:'30vw',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              
            }}>
              <div style={{
                padding:10,
                marginTop: '5px'
                }}>
                <button className="SubmitButton" onClick={this.SubmitTimeTable}>
                  SUBMIT
                </button>
              </div>

              {/* <div style={{padding:10}}>
                <button className="SubmitButton">
                  SHOW
                </button>
              </div> */}

            </div>
          </div>
          <div style={{
            // display:'flex',
            flex:1,
            height:'95vh'
          }}>
            <FullCalendar
              plugins={[ timeGridPlugin, interactionPlugin, dayGridPlugin ]}
              initialView="timeGrid"
              height= '94vh'
              dayMinWidth = '14vw'
              slotDuration={'00:30:00'}
              headerToolbar={true}
              eventMaxStack={100}
              dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric'}}
              slotLabelFormat={{hour: '2-digit', minute: '2-digit',hour12: false, meridiem: 'long'}}
              slotLabelContent={(info) => {
                return info.text ? info.text.replace(/24:00/g, '00:00') : '';
              }}
              dayHeaderContent = {this.dayHeaderChange}

              
              // dateClick={this.handleDateClick}
              initialDate = {this.state.DateWithoutTime[0]}
              visibleRange = {this.setVisibleRange}
              

              // initialEvents={this.state.RevEvents} 
              events={this.state.RevEvents}

              longPressDelay={500}
              nowIndicator={false}
              
              selectable={true}
              selectMirror={true}
              editable={true}

              select={this.SwipeTime}
              eventContent={this.renderEventContent}
              eventClick={this.handleEventClick}
              eventsSet={this.handleEvents}
              eventAllow={this.eventAllow}
            />

          </div>
      </div>
    );
  }
}

export default DayViewSlider;
export const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'All-day event',
    start: '2024-02-04T00:00:00',
    end: '2024-02-04T10:00:00',
    display: 'background',
    backgroundColor: '#67e66763',
    borderColor: '#67e66763'
  }
]


function GenerateRandomColor(){
  if(BGcolorFlag==0){
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16)+'82';
    RandomBGclolr = randomColor;
    BGcolorFlag = 1;
    return randomColor;
  }
  else {
    return RandomBGclolr;
  } 
}

const styles = {
  guideButton: {
    position: 'relative', // 使用绝对定位
    // top: '20px', // 距离顶部20px
    left: '10%', // 距离左侧20px
    width: '30px', // 设置按钮宽度
    height: '30px', // 设置按钮高度，与宽度相等形成圆形
    padding: '5px', // 内边距
    fontSize: '18px', // 感叹号的字体大小
    lineHeight: '18px', // 用于垂直居中感叹号
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