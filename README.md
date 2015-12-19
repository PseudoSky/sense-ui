# UDBS Air Quality Sensor

This is the client side application used for analysis and visualization of sensor data pulled from the sensor rest api.

![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/ui.png)

## References:

Server		https://github.com/PseudoSky/udbs-air-sense
Client		https://github.com/PseudoSky/sense-ui

## Dependencies:

Nodejs		https://nodejs.org/en/
Mongodb	https://www.mongodb.org/
Git		https://git-scm.com/


## Install:

```
mkdir udbs
cd udbs
git clone https://github.com/PseudoSky/udbs-air-sense
git clone https://github.com/PseudoSky/sense-ui

npm install -g yo grunt bower grunt-cli

cd udbs-air-sense

mongod

# Open new shell window to same dir

npm install

node server.js

# Open new shell window to same dir

cd ../sense-ui

npm install
bower install

grunt serve
```

## Use:

Open a browser and go to http://localhost:50000/seed
This will add the test seed data that we gathered from the sensor to the MongoDB instance.

Then navigate to http://localhost:9000/
You should see the ui shown in the image above

For more information about the available data, see https://github.com/PseudoSky/udbs-air-sense

## Graphs

![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/butane.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/carbon-monoxide.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/humidity.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/light.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/methane.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/pressure.png)
![](https://github.com/PseudoSky/sense-ui/blob/master/docs/images/temperature.png)
