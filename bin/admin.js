#!/usr/bin/env node

/* SETUP */

// Variables
const PASSWORD = "password"

// Inquirer
const inquirer = require('inquirer');
const inquirerloop = require('inquirer-loop');
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

// Database
const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDjIsj_l3YIC8USqx10ogINQ5oEIYjoKFo",
    authDomain: "cliapplication.firebaseapp.com",
    projectId: "cliapplication",
    storageBucket: "cliapplication.appspot.com",
    messagingSenderId: "1084293097407",
    appId: "1:1084293097407:web:68b898be2edf7418a3a30a",
    measurementId: "G-DFHHBEK47Q"
};

firebase.initializeApp(firebaseConfig);
const DATABASE = firebase.firestore();
DATABASE.settings({
    timestampsInSnapshots: true
});

/* BODY */

/*
TODO:
Allow admin to manage and view sessions
Allow admin to manage and view questions
Email user code to enter into the system
Catch Invalid Inputs
*/

// Prompt the user asking for a password to make sure they are allowed to access the admin control panel
console.clear();

inquirer
    .prompt([{
        type: 'password',
        name: 'password',
        message: 'Enter the password: ',
        mask: true
    }])
    .then(answers => {
        console.clear();
        if (answers.password === PASSWORD) {
            console.log("Welcome Admin!\n")
            menu();
        }
        else {
            console.log("Incorrect password!");
        }
    })
    .catch(error => {
        console.log(error);
    });

/**
 * Menu for when user enters the admin control panel
 */
function menu() {
    console.log("Admin Control Panel: ");
    inquirer
        .prompt([{
            type: 'rawlist',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Create New Interview', 'Add New Question', 'Exit']
        }])
        .then(answers => {
            console.clear();
            var answer = answers.choice;
            if (answer === 'Create New Interview')
                createInterview();
            else if (answer === 'Add New Question')
                menu();
            else if (answer === 'Exit') {
                console.log("Goodbye!");
                process.exit();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * Prompt the user to create a new interview session
 */
function createInterview() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the person this interview is for?: ',
            },
            {
                type: 'input',
                name: 'email',
                message: 'Who do you want to email this interview to?: '
            },
            {
                type: 'number',
                name: 'hours',
                message: 'How many hours do you want this session to last?: '
            },
            {
                type: 'number',
                name: 'minutes',
                message: 'How many minutes do you want this session to last?: '
            }
        ])
        .then(answers => {
            DATABASE.collection('sessions').add({
                name: answers.name,
                email: answers.email,
                hoursGiven: answers.hours,
                minutesGiven: answers.minutes,
                currentQuestion: 0,
                startTime: null,
                endTime: null,
                submitTime: null,
                results: []
            })
            .then(docRef => {
                console.clear();
                console.log(`Your unique code for this interview is: ${docRef.id}\nGive this to the interviewee (DO NOT LOSE IT)\n`)
                menu();
            })
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * Prompt the user to add a new question
 */
function addQuestion() {
    console.clear();
    console.log("This is currently under development!\n");
    menu();
}