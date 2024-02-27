'use strict'; // just to make sure

var ICSEVENT;

(function (ICSEVENT) {

  const lang = document.documentElement.lang.toLowerCase();

  const jsonData = async () => {
    try {
      const response = await fetch(jsonUrl);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const dateFormat = (date, time) => {
    const d = date.replaceAll('-', '');
    const t = time.replaceAll(':', '');
    return d + 'T' + t + 'Z';
  };

  const currentDate = () => {
    const date = new Date();

    const currDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const currTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return { currDate, currTime };
  };

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

  async function handleDownload() {
    const data = await jsonData();

    const common = data.common;
    const details = lang === 'it' ? data.detailsIt : data.detailsEn;

    const event = createEvent(common, details);

    createIcsFile(event);
  }

  const $button = document.querySelector('#downloadIcs');
  $button.addEventListener('click', handleDownload, false);

})(ICSEVENT || (ICSEVENT = {}));
