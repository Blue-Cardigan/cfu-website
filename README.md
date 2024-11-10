## How To Add Luma Events to the CfU Website

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

2. Go to [events.json file](https://github.com/Blue-Cardigan/cfu-website/blob/main/src/data/events.json)


3. Click the pencil icon (✏️) in the top right corner to edit the file

4. Add the event id as a new entry to the file

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

Hot tip: Copy and paste a previous event to avoid making formatting errors

5. Click the big green 'Commit changes...' button, then click 'Commit changes' in the popup (No need to add a long description).

6. The website will automatically update with your new event within a few minutes. If you don't see your changes after 5 minutes... contact me!

**Important Notes:**
- Make sure to keep the JSON format exactly as shown (including the commas and brackets)
- Events will be shown on the website in order, with the one at the top of the list first on the page.
- Double-check the event ID is correct before committing
