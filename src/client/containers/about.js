import _ from "lodash"
import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchSkills } from "../actions/skills"
import { AboutSite } from "../components/about"

// Init redux container for "About" page
const mapStateToProps = ({ about, skills }) => ({
    about,
    skills: _.map(skills, (value, key) => value)
})
const AboutContainer = connect(mapStateToProps, {fetchSkills})(AboutSite)

// Promote AboutSite from a component to a container
export default AboutContainer
