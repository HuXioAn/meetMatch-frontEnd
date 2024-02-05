import React from 'react';
// import dayjs from 'dayjs';
// import './DayViewSlider.css';
// import { Calendar } from '@douyinfe/semi-ui';
import * as api from './callapi.js';
// import moment from 'moment';

import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
      currentEvents: [],
      RevEvents: [],
      meetingNames:'',
      dateSelections:'',
      isLoading: true
    };
  }

  componentDidMount(){
    //  this.TokenFetch();
     this.InitialTimeTableFetch()
     console.log('check rev', this.state.RevEvents)
  }

//   TokenFetch = async () => {
    
//   }

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

      const backgroundEvents = RevdateSelections.map((date) => {
        const dateWithoutTime = date.replace('T00:00:00', '');
        return{
          id: this.createEventId(),
          title: ' ', 
          editable: 'false',
          selectable: 'false',
          start: date,
          end: dateWithoutTime +'T23:59:59',
          display: 'background',
          backgroundColor: '#67e66763',
          borderColor: '#67e66763'
        }
        
      });

      console.log('initialevents:',this.state.RevEvents);

      var newEvents = [];
      var eventnum = existingSelection.length;
      while (eventnum>0){
        var slotnum = existingSelection[eventnum-1].slots.length;
        while(slotnum>0){
          newEvents.push({
            id: this.createEventId(),
            title: ' ', 
            editable: 'false',
            selectable: 'false',
            display: 'background',
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

      const combinedEvents = backgroundEvents.concat(newEvents);

      this.setState({ 
        RevEvents: combinedEvents,
        dateSelections: RevdateSelections,
        meetingNames: RevmeetingNames,
        isLoading: false
       });
       
    } catch(error) {
      console.error("Error fetching table results:", error);
      this.setState({ isLoading: false });
    }
  };

  SubmitTimeTable = async (event) => {

    event.preventDefault();
    var eventnum = this.state.currentEvents.length;
    let refcolor = this.state.currentEvents[eventnum-1].backgroundColor;
    let starttime = [];
    let endtime = [];
    let color = '';

    if(this.state.currentEvents[eventnum-1].display == "background"){
      alert("[!]Select something!")
      return null;
    }

    while (eventnum>0){
      if("background" !=this.state.currentEvents[eventnum-1].display){
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


    console.log('color:',color);
    console.log('timeslot:',timeslot);
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
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
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
              height:'10vh'
            }}>

            <div style={{
              display:'flex',
              width:'50vw',
              justifyContent: 'flex-start', 
              alignItems: 'center',
              flexDirection: 'row'
              
            }}>
              <div style={{marginLeft:'10vw'}}>
                <h4>{this.state.meetingNames}</h4>
              </div>
              
            </div>
            <div style={{
              display:'flex',
              width:'50vw',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <button className="SubmitButton" onClick={this.SubmitTimeTable}>
                SUBMIT
              </button>
            </div>
          </div>
          <div style={{
            flex:1,
            height:'90vh'
          }}>
            <FullCalendar
              plugins={[ timeGridPlugin, interactionPlugin ]}
              initialView="timeGridWeek"
              // dateClick={this.handleDateClick}
              initialDate={this.state.dateSelections[1]}
              initialEvents={this.state.RevEvents} 
              height= '90vh'
              dayMinWidth = '14vw'
              slotDuration={'00:30:00'}
              longPressDelay={500}
              // dataSet={{
              //   startStr:this.state.dateSelections[0],
              //   endStr:this.state.dateSelections[dateSelections.length-1]
              // }}
              nowIndicator={true}
              headerToolbar={false}
              eventMaxStack={100}
              selectable={true}
              selectMirror={true}
              editable={true}
              select={this.SwipeTime}
              eventContent={this.renderEventContent}
              eventClick={this.handleEventClick}
              eventsSet={this.handleEvents}
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

// export class MainCalendar extends React.Component{
  
  

//   componentDidMount(){
//     this.InitialTimeTableFetch();
//   }


//   render(){
    
//     return(
      
//     )
//   }
// }


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

// function TokenFetch(){
//   const queryParams = new URLSearchParams(window.location.search);
//   const id = queryParams.get('id');
//   const name = queryParams.get('name');
//   const type = queryParams.get('type');
//   console.log(id, name, type);
  
// }



// export class MainPage extends React.Component {
  
//   render() {
//     return (
//       <FullCalendar
//         plugins={[ timeGridPlugin, interactionPlugin ]}
//         initialView="timeGridWeek"
//         dateClick={this.handleDateClick}
//         height= '100%'
//         // headerToolbar={false}

//       />
//     )
//   }
//   handleDateClick = (arg) => { // bind with an arrow function
//     alert(arg.dateStr)
//   }
// }
// export default MainPage;

 
// class Calendar<TEvent extends object = Event, TResource extends object = object> 
//interface CalendarProps<TEvent extends object = Event, TResource extends object = object
// function DayViewSlider(){
    
//     const localizer = dayjsLocalizer(dayjs)
//     return (
//     <div>
//         <Calendar
//             localizer={localizer}
//             style={{height: 500,
//                 width:500,
//             }}
//         />
//     </div>
//     );
// }

//   export default DayViewSlider;

// const today = new Date();
// const daysToAdd = 2;
// const enddate = new Date(today);
// enddate.setDate(today.getDate() + daysToAdd);

// export const DayViewSlider = () => (
// <Calendar 
//     mode="range" 
//     range={[today, enddate]} 
//     height='100%'
//     width='100%'
// />
// );

// export const DayViewPage = () => {
// return (
// <div className="DayViewSliderContainer" style={{
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   height: '80vh',
//   width: '90vw'  
// }}>
//   <DayViewSlider today={today} enddate={enddate} />
// </div>
// );
// }