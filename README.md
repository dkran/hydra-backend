# scanner

> nmap scanner web interface

## Build Setup

``` bash
# install dependencies
npm install && ./srv/npm install

# start websocket / scanning server:
node app.js (or I prefer nodemon)

# serve with hot reload at localhost:8080
./srv/npm run dev

# build for production with minification
./srv/npm run build

# build for production and view the bundle analyzer report
./srv/npm run build --report
```

nmap IS a dependency.  

Then just browse to localhost:8080, which will kick off the nmap scanner and watch the IPs and ports fly in.

I have the following goals:
 - OBVIOUSLY much more functional interface.
 - Add a form to customize scanning parameters
 - Get better data on what type of service is running
 - Show a thumbnail if it is an accessible http / https address that can be expandable
 - Maybe use some AI to find out which things are of interest to me and which aren't.