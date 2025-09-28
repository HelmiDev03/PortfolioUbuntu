import { Component } from "react";
import { useEffect, useState } from "react";

// Client-side only wrapper to prevent hydration issues
const ClientOnlyClock = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState("");
  
  useEffect(() => {
    setIsMounted(true);
    // Set initial time once mounted on client
    const getDisplayTime = () => {
      const now = new Date();
      if (props.onlyTime) {
        const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
        const minute = now.getMinutes().toString().padStart(2, '0');
        const meridiem = now.getHours() < 12 ? "AM" : "PM";
        return `${hour}:${minute} ${meridiem}`;
      } else if (props.onlyDay) {
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];
        return `${day} ${month} ${now.getDate()}`;
      } else {
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()];
        const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
        const minute = now.getMinutes().toString().padStart(2, '0');
        const meridiem = now.getHours() < 12 ? "AM" : "PM";
        return `${day} ${month} ${now.getDate()} ${hour}:${minute} ${meridiem}`;
      }
    };
    
    setTime(getDisplayTime());
    
    // Update time every 10 seconds
    const interval = setInterval(() => {
      setTime(getDisplayTime());
    }, 10000);
    
    return () => clearInterval(interval);
  }, [props.onlyDay, props.onlyTime]);
  
  // Return empty span during SSR, and actual time once mounted on client
  return <span>{isMounted ? time : ""}</span>;
};

// Keep the original implementation for reference
class ClockOriginal extends Component {
  constructor() {
    super();
    this.month_list = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    this.day_list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.state = {
      hour_12: true,
      current_time: new Date(),
    };
  }

  componentDidMount() {
    this.update_time = setInterval(() => {
      this.setState({ current_time: new Date() });
    }, 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update_time);
  }

  render() {
    const { current_time } = this.state;

    let day = this.day_list[current_time.getDay()];
    let hour = current_time.getHours();
    let minute = current_time.getMinutes();
    let month = this.month_list[current_time.getMonth()];
    let date = current_time.getDate().toLocaleString();
    let meridiem = hour < 12 ? "AM" : "PM";

    if (minute.toLocaleString().length === 1) {
      minute = "0" + minute;
    }

    if (this.state.hour_12 && hour > 12) hour -= 12;

    let display_time;
    if (this.props.onlyTime) {
      display_time = hour + ":" + minute + " " + meridiem;
    } else if (this.props.onlyDay) {
      display_time = day + " " + month + " " + date;
    } else
      display_time =
        day +
        " " +
        month +
        " " +
        date +
        " " +
        hour +
        ":" +
        minute +
        " " +
        meridiem;
    return <span>{display_time}</span>;
  }
}

// Export the client-only version to prevent hydration errors
export default ClientOnlyClock;
