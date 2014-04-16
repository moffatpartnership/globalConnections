## Global Connections

#### HTML
The index.html file contains the normal includes for the CSS and Javascript files.

As part of the copyright agreement you will have to include the text that explains the process (you'd want to do that anyway…)

First element explain the process globally

```
<div>
      <p>We have compared your DNA to about four thousand people from around the world and plotted how you are related genetically. Each circle represents a reference individual, someone with known ancestry, colour coded according to where they come from, and your DNA is represented by the larger pink circle. In each plot the genetic differences between people are summarised in two dimensions, so the nearer any two circles are to one another, the more similar they are genetically. People from the same population tend to also be close to each other genetically, and geographically neighbouring populations are often genetic neighbours as well.</p>
      <p>The plots are described in more detail below.</p>
</div>
```

The next element is the container for the select element to select the different plots, there are twelve in total.

```
<div id="GCSelect">
</div>
```

The third block is for the canvas and the description of that particular plot. The element for the description is nested within the canvas element.

```
<div id="canvasGlobalConnections" data-global-connections-id="52a0745c939138472f000591">
       <div id="plotDescription">
       </div>
</div>
```

The Canvas used for the plots will be created by the javascript as a child of the div element with the id canvasGlobalConnections.
There is a test AMA result id within the attribute data-global-connections-id you would replace this with the AMA result id for the customer.

###### Script tags

Jquery is used minimally and will be depreciated. (yuck)

The GSAP Greensock library is currently only used for the Ticker. The library usage will increase in future versions.

The two createjs libraries are used extensively.

You can use the stats display for performance monitoring, uncomment the initial load and jquery lines in the GCViewer.loadInit function, then uncomment the start and stop lines in the frameRender function.

#### CSS

There is a very simple CSS preloader within the #Processing styling with links to two assets in the /img folder. Otherwise please note the normal canvas margin and padding fills.

#### Javascript

The javascript file haplogroupFrequencies.js has an anonymous executing function called HFViewer, this loads the assets on start-up and then when all is loaded the GSAP Ticker fires the frameRender function.

There are three other anonymous functions handling the loading and the drawing.

#### Support

Email me at alan@scotlandsdna.com for any questions and usage.

©The Moffat Partnership
