# Simple Javascript ics calendar for HTML use

Generate and download an ics file for calendar events.

Supports multi languages based on HTML language `<html lang="en">`

## Usage

Create a link to the `ics-event.js` file at the end of the HTML file

```html
<script src="/src/ics-event.js"></script>
```

In `.ics` file specify json-data file path

```javascript
const jsonUrl = "../data/icsEventData.json";
```

Insert a link with `id="downloadIcs`

```html
<a href="javascript:void(0)" id="downloadIcs">Download ics</a>
```

Add data to the `icsEventData.json` file

```json
{
  "common": {
    "startDate": "2024-03-19",
    "startTime": "18:00:00",
    "endDate": "2024-03-19",
    "endTime": "22:30:00",
    "status": "CONFIRMED"
  },
  "detailsIt": {
    "title": "Titolo evento",
    "description": "descrizione <a href=\"[url]\">link</a>",
    "location": "Luogo",
    "url": "[url]"
  },
  "detailsEn": {
    "title": "Event title",
    "description": "description <a href=\"[url]\">link</a>",
    "location": "Location",
    "url": "[url]"
  }
}
```

## Ics parameters specification

### Show event like teams invitation

```html
"ORGANIZER;CN="+ commons.organizer.name + ":mailto:" + commons.organizer.email + "\n" +
```

Needs to add parameters in json file

```json
"common": {
    ...
    "organizer": {
      "name": "John Doe",
      "mail": "john.doe@mail.com"
    }
  },