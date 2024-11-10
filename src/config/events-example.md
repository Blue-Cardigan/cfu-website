## How To Edit Events Which Appear on the C4U Website

1. Find the event ID on lu.ma > manage > more > Embed Event > 

```
<a
  href="https://lu.ma/event/evt-9NdwGwCGgfXmWsU"
  class="luma-checkout--button"
  data-luma-action="checkout"
  data-luma-event-id="evt-9NdwGwCGgfXmWsU" <<<<<< YOU WANT THIS ID
>
  Register for Event
</a>

<script id="luma-checkout" src="https://embed.lu.ma/checkout-button.js"></script>
```

2. Add the ID at the top of the list in events.json e.g

```json
{
  "events": [
    {
      "id": "PASTE_ID_HERE"
    },
    {
      "id": "evt-7IIGiNQSemkFBOB"
    }
  ]
} 
```

3. Commit your changes to GitHub:
   - Go to the [events.json file](https://github.com/YOUR_REPO/blob/main/src/config/events.json) on GitHub
   - Click the pencil icon (✏️) in the top right corner to edit the file
   - Make your changes to the file
   - Scroll to the bottom of the page
   - Under "Commit changes":
     - Add a brief description like "Added new event: [Event Name]"
     - Select "Commit directly to the main branch"
     - Click the green "Commit changes" button

The website will automatically update with your new event within a few minutes. If you don't see your changes after 5 minutes, please contact the development team.

**Important Notes:**
- Make sure to keep the JSON format exactly as shown (including the commas and brackets)
- Only add new events at the top of the list
- Double-check the event ID is correct before committing

Need help? Contact [CONTACT_PERSON] at [EMAIL/SLACK]
