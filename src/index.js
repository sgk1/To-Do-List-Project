// index.js

import "./styles.css";
import {getToday} from './today.js';
import {getThisWeek} from './thisweek.js';
import {upcoming} from './upcoming.js';
import {anytime} from './anytime.js';
import {actionsDue} from './actionsdue.js';

//fetching left-pane button elements from template.html

const todayBtn = document.querySelector(".Today-left-pane");
const thisWeekBtn = document.querySelector(".This-Week-left-pane");
const upcomingBtn = document.querySelector(".Upcoming-left-pane");
const anytimeBtn = document.querySelector(".Anytime-left-pane");
const actionsDueBtn = document.querySelector(".Actions-Due-left-pane");
//adding event listeners to left-pane buttons

actionsDueBtn.addEventListener('click', ()=> {
    actionsDue();
    document.querySelectorAll('.left-pane-button').forEach(
        btn => {btn.classList.remove('active')}
    );
    actionsDueBtn.classList.add('active');
});

todayBtn.addEventListener('click', ()=> {
    getToday();
    document.querySelectorAll('.left-pane-button').forEach(
        btn => {btn.classList.remove('active')}
    );
    todayBtn.classList.add('active');
});

thisWeekBtn.addEventListener('click',()=> {
    getThisWeek();
    document.querySelectorAll('.left-pane-button').forEach(
        btn => {btn.classList.remove('active')}
    );
    thisWeekBtn.classList.add('active');
});

upcomingBtn.addEventListener('click',()=> {
    upcoming();
    document.querySelectorAll('.left-pane-button').forEach(
        btn => {btn.classList.remove('active')}
    );
    upcomingBtn.classList.add('active');
});

anytimeBtn.addEventListener('click', ()=> {
    anytime();
    document.querySelectorAll('.left-pane-button').forEach(
        btn => {btn.classList.remove('active')}
    );
    anytimeBtn.classList.add('active');
});

getToday(); // default view when page loads