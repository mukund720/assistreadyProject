import { Component, VERSION } from '@angular/core';
import { MouseEvent, AgmMap } from '@agm/core';
import { TravelMarker, TravelMarkerOptions, TravelData, TravelEvents, EventType } from 'travel-marker';
var locationData=[]
declare var google: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  service_area_lat:any='13.200342178344727';
  service_area_lng:any='77.70947265625';
  service_drop_area_lat:any='12.97194';
  service_drop_area_lng:any='77.59369';
  customer_data:any={name:'Mukund','mobile':'8677010031','email':'mukund720@gmail.com'}

 // google maps zoom level
 zoom: number = 15;
 // initial center position for the map
 lat: number = 12.927923;
  lng: number = 77.627106;

  dest_lat: number = 12.927923;
  dest_lng: number = 77.627106;

 map: any;
 line: any;
 directionsService: any;
 marker: TravelMarker = null;

 // speedMultiplier to control animation speed
 speedMultiplier = 1;
getNext5KM()
{
  let meters = 50;

// number of km per degree = ~111km (111.32 in google maps, but range varies
  // between 110.567km at the equator and 111.699km at the poles)
// 1km in degree = 1 / 111.32km = 0.0089
// 1m in degree = 0.0089 / 1000 = 0.0000089
let coef = meters * 0.0000089;

let new_lat = this.lat + coef;

// pi / 180 = 0.018
let new_long = this.lng + coef / Math.cos(this.lat * 0.018);
this.dest_lat=new_lat
this.dest_lng=new_long;
locationData=[[this.lat,this.lng],[this.dest_lat,this.dest_lng]]
this.service_drop_area_lat=this.dest_lat
this.service_drop_area_lng=this.dest_lng
console.log(`5km Positon: ${this.dest_lng} ${this.dest_lat}`);

}

updateMap()
{
  this.getPosition().then(pos=>
    {
       console.log(`Positon: ${pos.lng} ${pos.lat}`);
       this.lat=pos.lat;
       this.lng=pos.lng
       this.service_area_lat=pos.lat
       this.service_area_lng=pos.lng
    });
this.getNext5KM();
setInterval(function(){
  // this.mockDirections(false)
}, 30000)
}
 onMapReady(map: any) {
   console.log(map);
    this.updateMap();
   console.log(map);
   this.map = map;
   // this.calcRoute();
   this.mockDirections(false);
   // this.initEvents();
 }


 // get locations from direction service
 calcRoute() {
   this.line = new google.maps.Polyline({
     strokeOpacity: 0.5,
     path: [],
     map: this.map
   });
   
   const start = new google.maps.LatLng(this.lat,this.lng);
   const end = new google.maps.LatLng(this.dest_lat,this.dest_lng);
   const request = {
       origin:start,
       destination:end,
       travelMode: google.maps.TravelMode.BICYCLING
   };
   this.directionsService = new google.maps.DirectionsService();
   this.directionsService.route(request, (response, status) => {
     // Empty response as API KEY EXPIRED
     console.log(response);
     if (status == google.maps.DirectionsStatus.OK) {
       var legs = response.routes[0].legs;
       for (let i=0;i<legs.length; i++) {
         var steps = legs[i].steps;
         for (let j=0; j<steps.length; j++) {
           var nextSegment = steps[j].path;
           for (let k=0; k<nextSegment.length; k++) {
             this.line.getPath().push(nextSegment[k]);
           }
         }
       }
       this.initRoute();
     }
   });
 }


 // mock directions api
 mockDirections(is_custom) {
   const locationArray = locationData.map(l => new google.maps.LatLng(l[0], l[1]));
   this.line = new google.maps.Polyline({
     strokeOpacity: 0.5,
     path: [],
     map: this.map
   });
   locationArray.forEach(l => this.line.getPath().push(l));
 
   const start = new google.maps.LatLng(this.lat,this.lng);
   const end = new google.maps.LatLng(this.dest_lat,this.dest_lng);

   const startMarker = new google.maps.Marker({position: start, map: this.map, label: 'A'});
   const endMarker = new google.maps.Marker({position: end, map: this.map, label: 'B'});
   this.initRoute();
 }

 // initialize travel marker
 initRoute() {
   const route = this.line.getPath().getArray();

   // options
   const options: TravelMarkerOptions = {
     map: this.map,  // map object
     speed: 50,  // default 10 , animation speed
     interval: 10, // default 10, marker refresh time
     speedMultiplier: this.speedMultiplier,
     markerOptions: { 
       title: 'Ready Assist',
       animation: google.maps.Animation.DROP,
       icon: {
         url: 'https://i.imgur.com/eTYW75M.png',
         // This marker is 20 pixels wide by 32 pixels high.
         animation: google.maps.Animation.DROP,
         // size: new google.maps.Size(256, 256),
         scaledSize: new google.maps.Size(128, 128),
         // The origin for this image is (0, 0).
         origin: new google.maps.Point(0, 0),
         // The anchor for this image is the base of the flagpole at (0, 32).
         anchor: new google.maps.Point(53, 110)
       }
     },
   };
 
   // define marker
   this.marker = new TravelMarker(options);
   
   // add locations from direction service 
   this.marker.addLocation(route);
     
   setTimeout(() => this.play(), 2000);
 }

 // play animation
 play() {
   this.marker.play();
 }

 // pause animation
 pause() {
   this.marker.pause();
 }

 // reset animation
 reset() {
   this.marker.reset();
 }

 // jump to next location
 next() {
   this.marker.next();
 }

 // jump to previous location
 prev() {
   this.marker.prev();
 }

 // fast forward
 fast() {
   this.speedMultiplier*=2;
   this.marker.setSpeedMultiplier(this.speedMultiplier);
 }

 // slow motion
 slow() {
   this.speedMultiplier/=2;
   this.marker.setSpeedMultiplier(this.speedMultiplier)
 }

 initEvents() {
   this.marker.event.onEvent((event: EventType, data: TravelData) => {
     console.log(event, data);
   });
 }
 setCordinate()
 {
   alert('feature not enabled yet');
   return false;
   this.reset();
   this.mockDirections(true);
 }
 getPosition(): Promise<any>
 {
   return new Promise((resolve, reject) => {

     navigator.geolocation.getCurrentPosition(resp => {

         resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
       },
       err => {
         reject(err);
       });
   });

 }
}
