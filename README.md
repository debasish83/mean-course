# MeanCourse

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Setting up visual studio code
Install 2 extensions - Angular Essentials by John Papa and Material Icon Theme by Phillip Kief

## Angular bidirectional dataflow
At the minimum we need a input for text and button to save the text
Now on save post we ahve to read the data and save it to mongo via node.js API call
Pass the method of the component class that will be executed here
To figure out all html components and value bindings look into mdn resources
This is one way to get the data, angular also support 2-way binding setting and reading the value
oneway [value]="newPost" #postInput bidirectional [(ngmodel)]
<textarea row="6" [value]="newPost" #postInput></textarea>
newPost will be received as HTMLTextArea and newPost.value has the string that user entered
<button> (click)="onAddPost(newPost)">Save Post</button>

## Angular material design
We will use angular material design, use the components and the corresponding css that comes with it
Go to material.angular.io to see details of the components and styling
Using cli: ng add @angular/material will get all angular material
We are picking up prebuilt indigo/pink theme
Default angular material version is 13 but we can downgrade it using npm install --save @angular/material@8 --save-exact

## Express setup
Tested node.js http and express modules, used express to setup /api/posts and then after setting up the angular
service to call the express API, it led to a CORS error since angular app running on http://localhost:4200 want to make a
call to cross origin http://localhost:3000/api/posts. It got fixed by adding specific headers that allow CORS

Learn Node + Express from Scratch (for free!): https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
Creating a REST API with Node + Express (+ MongoDB): https://academind.com/learn/node-js/building-a-restful-api-with/

## MongoDB setup
Create a mongodb cluster on the cloud and get the username/password
username: mean-admin
password: iFiaNlLfVrckIwct
We should save them in github secrets and not in the code
We used our current ip address to connect with the cluster. If we are away from the project for a couple of days the
ipaddress can change and we may need to update it with a new ip address
we will use mongoose to define a schema and model for mongodb, mongoose add schema/model using mongo driver
