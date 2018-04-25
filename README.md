# scanner

> nmap scanner web interface  Really interesting and fun to use, I promise you.  Seems to work on both linux (I test on kali), and OSX after some tweaks I made.  Must be run as superuser for the nmap scan type.

## Build Setup

``` 
# install dependencies
npm install

# edit the adapter mac and router mac settings in the file.

# start websocket / scanning server:
node app.js (or I prefer nodemon)

# wait for hydra-scanner drones to connect and request the ips found to do more thorough scans.
```

## Project Goals:
 - Map the internet's state at all times in terms of services and ports on all IP's available.
 - I realize this is impossible, but I think we can do this.

## Future goals:
 - Host the webui and server on a domain so anyone may publicly view it free from ads or paying.  I could do this now, but it doesn't look or function pretty yet, but the concept is implemented.  I will document code more.  I will also provide the raw database for anyone with rethinkdb so they can perform any IP custom queries they wish, although I'd rather the people who want that info contribute to the webUI or backend to make it more versatile
 - `nmap` scanning is the limiting factor here.  
 - Maybe use some AI to find out which things are of interest to me and which aren't.