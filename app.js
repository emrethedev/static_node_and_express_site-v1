// 
// app.js
// Static Node.js and Express Site
// Makes use of Node.js, Express and Pug templates to create a portfolio site to showcase former projects.
//

// Adds necessary depenencies:
const express = require("express");
const app = express();
const expressPort = 3000;
const data = require("./data.json");
const {projects} = data;

// Template/View Engine Setup for Pug.
app.set("view engine", "pug");

// Serves the static content from ./public as ./st (virtually)
app.use("/st", express.static("public"));

/*
APP ROUTES
*/

// An "index" route (/) to render the "Home" page with the locals set to data.projects
app.get("/", (req, res) => res.render("index", {projects}));

// An "about" route (/about) to render the "About" page
app.get("/about", (req, res) => res.render("about"));

// Dynamic "project" routes (/project) based on the id of the project that render a customized version of the Pug project
app.get("/project/:id", (req, res, next) => {
    
    const projId = req.params.id;
    
    // When to render the projects, when to throw an error
    if ( projId < projects.length ) { 
        
        const proj = projects.find( ({id}) => id === +projId ); // Checking and converting
        res.render("project", {proj});

    } else {

        const err = new Error("We could't find that");
        err.status = 404;
        next(err);

    }    
});

// // Error handling for the application.
// // In the event of navigating to a non-existent route, or if a request for a resource fails.

app.use( ( req, res, next ) => {

    const err = new Error("Cannot process your request");
    err.status = 404;
    next(err);

});

// // Own Error Handler to Bypass Express's Handler
// // https://teamtreehouse.com/library/error-handling-middleware

app.use( ( err, req, res, next ) => {

    res.locals.error = err;
    const stat = err.status || 500;
    res.status(stat);
    res.render( "error", err );
    
} );

// Starts the Express Web Server.
app.listen(expressPort, () => {
    console.info(`Static Node.js and Express Site: Listening at http://localhost:${expressPort}`);
});