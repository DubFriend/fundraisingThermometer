Foofurple's HTML5 Simple Fundraising Thermometer

A simple HTML5 Canvas / pure javascript app that
lets the user create a fundraising thermometer
image.

The nice thing about this is that it isn't a 
widget or plugin that needs to be installed,
 it just generates a .png image which can 
be used anywhere.

PUBLIC DOMAIN because it's a completely obvious
 thing to do and in a sane world no-one would think
to apply the concept of intellectual property to
something like this :)

See it in action at foofurple.com/thermometer/

Example Use
```HTML
<div id="put-my-thermometer-here"></div>

<!-- Bottom of the page -->
<script src="thermometer.js"></script>
<script>
    //create and render a thermometer.
    var thermometer = createFundraisingThermometer({
        //id of the HTML element in which to render the thermometer
        containerHTMLid: "put-my-thermometer-here"
        //width of the thermometer
        width: 200,
        //color of the thermometer fill
        color: "blue",
        //color of the thermometer outline
        lineColor: "#1B1B1B",
        textColor: "black",
        //fundraising goal amount
        targetAmount: 100,
        //amount raised so far
        amountSoFar: 60,
        currency: '$',
        targetAmountLabel: "Target: ",
        amountSoFarLabel: "Raised: "
    });

    //can subscribe to "change" events 
    thermometer.subscribe("change", function (data) {
        console.log(data);
    });

    //"change" events are triggered whenever a thermometers properties are set
    thermometer.set({ amountSoFar: thermometer.get("amountSoFar") + 5 });
</script>
```
