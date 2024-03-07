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
      OverlapTimeSlot: [],     //时间转换完用于统计结果
      meetingNames:'',
      dateSelections:'',      //API收取的时间选择，可能为不连续，来替代前台header的显示
      DateWithoutTime:'',
      DateNum:'',
      isLoading: true,
      isGuideVisible: false,
      guideStep: 0,
      displayAsBackground: false,
      ShowEvents: [], // 初始时可能与RevEvents相同
      showingOverlap: false // 初始时显示的是RevEvents
    };
    this.handleChange = this.handleChange.bind(this);
    this.ShowOverlap = this.ShowOverlap.bind(this);
  }

  ///////////////////////////////////switch

  handleChange(checked) {
    const updatedEvents = this.state.ShowEvents.map(event => ({
      ...event,
      display: checked ? 'background' : 'block'
    }));

    this.setState({ ShowEvents: updatedEvents, displayAsBackground: checked });

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
        // dateOnly = existingSelection[eventnum-1].slots[slotnum-1].startTime;

        while(slotnum>0){
          let [dateOnlyStart, timeOnlyStart] = existingSelection[eventnum-1].slots[slotnum-1].startTime.split('T');
          let [dateOnlyEnd, timeOnlyEnd] = existingSelection[eventnum-1].slots[slotnum-1].endTime.split('T');
  
          let [existStart, existStartTime] = RevdateSelections[0].split('T');
  
          let index = RevdateSelections.findIndex(d => d.startsWith(dateOnlyStart));
  
          let startDate = new Date(existStart);
          let newDate = new Date(startDate.setDate(startDate.getDate() + index));
          
          let dateStartString = newDate.toISOString().split('T')[0];
          let RevAddateStartString = dateStartString+'T'+timeOnlyStart;
          let RevAddateEndString = dateStartString+'T'+timeOnlyEnd;
  
          newEvents.push({
            id: this.createEventId(),
            title: ' ', 
            editable: false,
            selectable: false,
            display: 'block',
            // start: existingSelection[eventnum-1].slots[slotnum-1].startTime,
            // end: existingSelection[eventnum-1].slots[slotnum-1].endTime,
            start: RevAddateStartString,
            end: RevAddateEndString,
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
        isLoading: false,
        ShowEvents: newEvents
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
    
    let dataSelection = new Date(this.state.dateSelections[0]);

    const dateList = this.state.DateWithoutTime;
    const dateNum = this.state.DateNum;

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
        const [setDatePartStart, setTimeStart] = this.state.currentEvents[eventnum-1].startStr.split('T');
        const [setDatePartEnd, setTimeEnd] = this.state.currentEvents[eventnum-1].endStr.split('T');
        let datestart = new Date(setDatePartStart);
        let index = Math.floor((datestart - dataSelection) / (1000 * 60 * 60 * 24));
        if (index >= 0 && index < dateNum) {
          const submitDate = dateList[index];
          const submitTimeStart = submitDate+'T'+setTimeStart;
          const submitTimeEnd = submitDate+'T'+setTimeEnd;
          // let submitTime = ;
          console.log('events:',eventnum);
          starttime.push(submitTimeStart);
          endtime.push(submitTimeEnd);
        }
        
      }
      eventnum--;
    }
    color = refcolor;
    const timeslot = starttime.map((starttime, index) => ({
      'startTime': starttime,
      'endTime': endtime[index],
    }));
    console.log("timeslot:",timeslot);





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
    // console.log('startTime', this.state.currentEvents[0].startStr);
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

  //////////////////////////////////////////////////calculate overlap
  findOverlapBetweenColors = (events) => {
    // 按颜色分类
    const eventsByColor = events.reduce((acc, event) => {
      if (!acc[event.backgroundColor]) {
        acc[event.backgroundColor] = [];
      }
      acc[event.backgroundColor].push(event);
      return acc;
    }, {});
  
    // 存储每种颜色的时间段整合结果
    const mergedByColor = {};
    
    // 对每种颜色的时间段进行整合
    Object.keys(eventsByColor).forEach(color => {
      mergedByColor[color] = this.mergeTimeRanges(eventsByColor[color]);
    });
  
    // 查找不同颜色间的时间段重合情况
    const overlaps = [];
    const colors = Object.keys(mergedByColor);
    let commonOverlaps  = [];
    let maximumOverlap = { count: 0, timeRanges: [] };

    if(mergedByColor.length==1){
      return this.state.RevEvents
    }else{
      let allTimes = [];
      colors.forEach(color => {
        mergedByColor[color].forEach(range => {
          allTimes.push(new Date(range.start).getTime());
          allTimes.push(new Date(range.end).getTime());
        });
      });
      allTimes = [...new Set(allTimes)].sort((a, b) => a - b);
      for (let i = 0; i < allTimes.length - 1; i++) {
        let startTime = allTimes[i];
        let endTime = allTimes[i + 1];
        let count = 0;
    
        colors.forEach(color => {
          mergedByColor[color].forEach(range => {
            if (new Date(range.start).getTime() <= startTime && new Date(range.end).getTime() >= endTime) {
              count++;
            }
          });
        });
    
        // 如果当前时间段的重叠颜色数超过之前记录的最大值，更新最大值
        if (count > maximumOverlap.count) {
          maximumOverlap = { count: count, timeRanges: [{ start: new Date(startTime).toISOString(), end: new Date(endTime).toISOString() }] };
        } else if (count === maximumOverlap.count) {
          // 如果当前时间段的重叠颜色数等于之前记录的最大值，添加这个时间段到结果中
          maximumOverlap.timeRanges.push({ start: new Date(startTime).toISOString(), end: new Date(endTime).toISOString() });
        }
      }
      // let baseRanges = mergedByColor[colors[0]];
      // for (let i = 1; i < colors.length; i++) {
      //   let nextColorRanges = mergedByColor[colors[i]];
      //   let newCommonOverlaps = [];
    
      //   // 与下一个颜色分类的时间段比较
      //   baseRanges.forEach(baseRange => {
      //     nextColorRanges.forEach(nextRange => {
      //       const startMax = new Date(Math.max(new Date(baseRange.start), new Date(nextRange.start)));
      //       const endMin = new Date(Math.min(new Date(baseRange.end), new Date(nextRange.end)));
            
      //       // 如果有重叠
      //       if (startMax < endMin) {
      //         newCommonOverlaps.push({
      //           start: startMax.toISOString(),
      //           end: endMin.toISOString()
      //         });
      //       }
      //     });
      //   });
    
      //   // 更新基础比较范围为当前找到的重叠部分
      //   baseRanges = newCommonOverlaps;
      // }
      // commonOverlaps = baseRanges;
      // ranges1.forEach(range1 => {
      //   ranges2.forEach(range2 => {
      //     const startMax = new Date(Math.max(new Date(range1.start), new Date(range2.start)));
      //     const endMin = new Date(Math.min(new Date(range1.end), new Date(range2.end)));
    
      //     // 如果存在重叠
      //     if (startMax < endMin) {
      //       overlapSet.push({start: startMax.toISOString(), end: endMin.toISOString()});
      //     }
      //   });
      // });
      // // for (let j = i + 1; j < colors.length; j++) {
      // //   const overlapsBetweenColors = this.findOverlaps(mergedByColor[colors[i]], mergedByColor[colors[j]]);
      // //   overlaps.push(...overlapsBetweenColors);
      // // }
      return maximumOverlap;
      }
    
    }
      

  
  mergeTimeRanges = (events) => {
    // 按开始时间排序
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
  
    const merged = [];
    let current = null;
  
    events.forEach(event => {
      if (!current) {
        current = {...event};
      } else if (new Date(event.start) <= new Date(current.end)) {
        current.end = new Date(Math.max(new Date(current.end), new Date(event.end))).toISOString();
      } else {
        merged.push(current);
        current = {...event};
      }
    });
  
    if (current) {
      merged.push(current);
    }
  
    return merged;
  };
  
  findOverlaps = (ranges1, ranges2) => {
    const overlaps = [];
  
    ranges1.forEach(range1 => {
      ranges2.forEach(range2 => {
        const startMax = new Date(Math.max(new Date(range1.start), new Date(range2.start)));
        const endMin = new Date(Math.min(new Date(range1.end), new Date(range2.end)));
  
        // 如果存在重叠
        if (startMax < endMin) {
          overlaps.push({start: startMax.toISOString(), end: endMin.toISOString()});
        }
      });
    });
  
    return overlaps;
  };

  ShowOverlap = async (event) => {
    event.preventDefault();
    if (this.state.RevEvents.length == 0){
      alert('No Events Created!');
    }else{
      if (this.state.showingOverlap) {

        this.setState({ 
          ShowEvents: this.state.RevEvents,
          showingOverlap: false 
        });
      } else {
        const res = this.findOverlapBetweenColors(this.state.RevEvents);
        console.log('res:', res);
        // OverlapTime.push({
      //   id: this.createEventId(),
      //   title: '', 
      //   editable: false,
      //   selectable: false,
      //   display: 'block',
      //   start: res.start,
      //   end: res.end,
      //   backgroundColor: '#007bff',
      //   borderColor: '#007bff'
      // }) 
      // res.forEach(overlap => {
      //   OverlapTime.push({
      //     id: this.createEventId(),
      //     title: '',
      //     editable: false,
      //     selectable: false,
      //     display: 'block',
      //     start: overlap.start, // 确保这里overlap有start属性
      //     end: overlap.end,     // 确保这里overlap有end属性
      //     backgroundColor: '#007bff',
      //     borderColor: '#007bff'
      //   });
      // });
      // this.setState({
      //   OverlapTimeSlot: OverlapTime
      // }, () => {
      //   console.log('OverlapTimeSlot:', this.state.OverlapTimeSlot);
      // });
      // console.log('OverlapTimeSlot:', this.state.OverlapTimeSlot);
        
      // const OverlapTime = res.map(overlap => ({
      //     id: this.createEventId(),
      //     title: '',
      //     editable: false,
      //     selectable: false,
      //     display: 'block',
      //     start: overlap.start,
      //     end: overlap.end,
      //     backgroundColor: '#007bff',
      //     borderColor: '#007bff'
      //   }));
        this.setState({ OverlapTimeSlot: [] }, () => {
          
          const OverlapTime = [];
          res.timeRanges.forEach(overlap => {
            OverlapTime.push({
              id: this.createEventId(),
              title: '',
              editable: false,
              selectable: false,
              display: 'block',
              start: overlap.start,
              end: overlap.end,
              backgroundColor: '#007bff',
              borderColor: '#007bff'
            });
          });
      
          this.setState({
            OverlapTimeSlot: OverlapTime,
            ShowEvents: OverlapTime,
            showingOverlap: true
          }, () => {
            console.log('OverlapTimeSlot:', this.state.OverlapTimeSlot);
          });
        });
      }
    }
    
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
              width:'60vw',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',

            }}>
              <div style={{
                display:'flex',
                width:'5vw',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '25px',
                marginLeft: '10px'
                }}>
                <button onClick={() => this.setIsGuideVisible(true)} style={styles.guideButton}>?</button>
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
                width:'45vw',
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
                flexDirection: 'column',
                marginTop: '25px',
                marginRight: '10px'
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
              width:'40vw',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              
            }}>
              <div style={{
                // padding:10,
                marginTop: '15px',
                marginRight: '10px'
                }}>
                <button className="SubmitButton" onClick={this.SubmitTimeTable}>
                  SUBMIT
                </button>
              </div>

              <div style={{
                // padding:10,
                marginTop: '15px',

                }}>
                <button 
                  className="ShowResult" 
                  onClick={this.ShowOverlap}
                  style={{ 
                    backgroundColor: this.state.showingOverlap ? '#007bff' : 'lightgrey',
                    color: this.state.showingOverlap ? 'white' : 'black' 
                  }}
                >
                  ANALYSE
                </button>
              </div>

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
              events={this.state.ShowEvents}

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
    fontSize: '20px', // 感叹号的字体大小
    lineHeight: '18px', // 用于垂直居中感叹号
    textAlign: 'center', // 文本居中对齐
    border: 'none', // 无边框
    // borderRadius: '50%', // 边框半径50%形成圆形
    backgroundColor: 'white', // 淡蓝色背景
    color: 'black', // 白色文本
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