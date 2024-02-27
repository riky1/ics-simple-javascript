'use strict'; // just to make sure

var ICSEVENT;

(function (ICSEVENT) {

  const $button = document.querySelector('#downloadIcs');
  const lang = document.documentElement.lang.toLowerCase();  
  const jsonUrl = "../data/icsEventData.json";

  /**
   * load data from json file
   * @return {OBJECT} jsonData
   */
  const jsonData = async () => {
    try {
      const response = await fetch(jsonUrl);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * format dateTIme
   * @param {string} date - type: 2024-03-19
   * @param {string} time - type: 22:30:00
   * @return {STRING} dateTime type: 20240319T223000Z
   */
  const dateFormat = (date, time) => {
    const d = date.replaceAll('-', '');
    const t = time.replaceAll(':', '');
    return d + 'T' + t + 'Z';
  };

  /**
   * get current dateTime
   * @return {OBJECT} dateTime type: { 2024-03-19, 22:30:00 }
   */
  const currentDate = () => {
    const date = new Date();

    const currDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const currTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return { currDate, currTime };
  };

  /**
   * get uuid
   * @return {STRING} uid
   */
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * create calendar parameters
   * @param {Object} common - common data
   * @param {Object} details - language-specific data
   * @return {STRING} ics parameters
   */
  const createEvent = (common, details) => {
    const event =
      'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n' +
      'CALSCALE:GREGORIAN\n' +
      'PRODID:-//Compnay Inc//Product Application//EN\n' +
      'METHOD:PUBLISH\n' +
      'X-PUBLISHED-TTL:PT1H\n' +
      'BEGIN:VEVENT\n' +
      'UID:' + uuidv4() + '\n' +
      'SUMMARY:' + details.title + '\n' +
      'DTSTAMP:' + dateFormat(currentDate().currDate, currentDate().currTime) + '\n' +
      'DTSTART:' + dateFormat(common.startDate, common.startTime) + '\n' +
      'DTEND:' + dateFormat(common.endDate, common.endTime) + '\n' +
      'DESCRIPTION:' + details.description + '\n' +
      'X-ALT-DESC;FMTTYPE=text/html:' + details.description + '\n' +
      'LOCATION:' + details.location + '\n' +
      'URL:' + details.url + '\n' +
      'STATUS:' + common.status + '\n' +
      'END:VEVENT\n' +
      'END:VCALENDAR';

    console.log(event);

    return event;
  };

  /**
   * create and download ics file
   * @param {string} event - ics parameters
   */
  function createIcsFile(event) {
    const filename = 'calendar.ics';
    const file = new File([event], filename, { type: 'text/calendar' });
    const url = URL.createObjectURL(file);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  /**
   * handle click on button
   */
  async function handleDownload() {
    const data = await jsonData();

    const common = data.common;
    const details = lang === 'it' ? data.detailsIt : data.detailsEn;

    const event = createEvent(common, details);

    createIcsFile(event);
  }

  $button.addEventListener('click', handleDownload, false);

})(ICSEVENT || (ICSEVENT = {}));
