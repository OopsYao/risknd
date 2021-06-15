# Risknd

A simple script to obtain the imgs of [Risk-neutral densities](https://alwe.shinyapps.io/risknd/).

We use [puppeteer](https://developers.google.com/web/tools/puppeteer) (core) to simulate
the brower environment since this site use sockjs for backend communication which
makes it hard to analyze the traffic.

The way to update the selected date is based on the analysis of the [src script](https://alwe.shinyapps.io/risknd/srcjs/input_binding_slider.js).
