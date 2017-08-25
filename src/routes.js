import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import AboutContainer from "./containers/about"
import BlogContainer from "./containers/blog"
import { ContactSite } from "./components/contact"
import IndexContainer from "./containers/index"
import ProjectsContainer from "./containers/portfolio"


/**
* Main site component function comprised of a multitude of site through routing
*/
const Main = (props) => (
    <main>
        <Switch>
            <Route exact path="/"
                render={() => (<IndexContainer {...props} />)} />
            <Route exact path="/about"
                render={() => (<AboutContainer {...props} />)} />
            <Route exact path="/blog"
                render={() => (<BlogContainer {...props} />)} />
            <Route exact path="/contact"
                render={() => (<ContactSite {...props} />)} />
            <Route exact path="/portfolio"
                render={() => (<ProjectsContainer {...props} />)} />
            <Route component={NotFound} />
        </Switch>
    </main>
)

/**
* 404 page component function
*/
const NotFound = () => (
    <div className="not-found-site">
        <div className="billboard">
            <div className="container"></div>
        </div>
    </div>
)


module.exports = { Main, NotFound }
