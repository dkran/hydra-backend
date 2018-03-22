# scanner

> nmap scanner web interface  Really interesting and fun to use, I promise you

## Build Setup

``` bash
# install dependencies
npm install && ./srv/npm install

# start websocket / scanning server:
node app.js (or I prefer nodemon)

# serve with hot reload at localhost:8000
./srv/npm run dev

# build for production with minification
./srv/npm run build

# build for production and view the bundle analyzer report
./srv/npm run build --report
```

##Project Goals:
 - Map the internet's state at all times in terms of services and ports on all IP's available.
 - I realize this is impossible, but I think we can do this.

##Current Strategy: 
 - Store all data in RethinkDB server  I think RethinkDB works well because of changefeeds.  Using node.js backend to run massscan, then if any port is found on an IP an nmap scan for top 100 ports is initiated. Websockets are used to alert clients of any updates.  Use Vue.js web interface to view incoming data, complete with nmap data parsed from xml to json.  I could do more like geoip and the like, but I'm working the long haul on this one, with help or without.

##Production goals:
 - Host the server on a domain so anyone may publicly view it free from ads or paying.  I could do this now, but it doesn't look or function pretty yet, but the concept is implemented.  I will document code more.
 - Improve VueJS interface, websocket type definitions so they are more versatile.  
 - `nmap` scanning is the limiting factor here.  
 - use a message queue to pass nmap scans to client computers, then pass json results back (a microservice), that I can run on SBC's or others may run to register with the message queue, then get IP's to scan.  I find about 10 concurrent scans work okay.  If enough participation happens, we can view the state of the internet almost in realtime if enough are running.
  - perhaps create a message queue microservice in and of itself so the main service puts information into the database and using masscan, then passes any online computer to the message queue which will then distribute the scans to any registered clients.  Upon receiving results, the main process will insert the info into RethinkDB (or overwrite old data if changes are there), and push updates to any vue.js clients.  So 3 services basically.
 - OBVIOUSLY much more functional interface.  In terms of Documentation, logging, display, websocket classification, etc.
 - Add a form to customize scanning parameters
 - Show a thumbnail if it is an accessible http / https address that can be expandable
 - Maybe use some AI to find out which things are of interest to me and which aren't.