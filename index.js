const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const addJobsToDb = require('./model/job').addJobs;
const clickLogin = require('./evaluate/clickLogin');
const getJobs = require('./evaluate/getJobs');
const env = process.env;

const loginSelector = '#login_username';
const passwordSelector = '#login_password';
const submitSelector = '#main-auth-card [type="submit"]';
const jobSelectors = {
    jobListSelector: '#feed-jobs section',
    title: '[data-job-title] a',
    location: '.client-location',
    spent: '.client-spendings strong',
    skills: '.o-tag-skill span',
    paidInfo: 'small.text-muted.display-inline-block.m-sm-top'
};
const newerSelector = '.load-newer-button';

mongoose.connect(env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});

const newerData = page => {
    await page.waitForSelector(newerSelector);
    await page.click(submitSelector);
}

(async () => {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    await page.goto(env.URL);
    await page.type(loginSelector, env.LOGIN);
    await page.click(submitSelector);
    await page.waitFor(500);
    await page.type(passwordSelector, env.PASSWORD);
    await page.waitFor(500);
    await page.evaluate(clickLogin);
    await page.waitForSelector(jobSelectors.jobListSelector);
    console.log('jobs page open');
    const jobData = await page.evaluate(getJobs, jobSelectors);
    await addJobsToDb(jobData);
    // await browser.close();
})();


/**
 * job {Object}
 * job.id {String}
 * job.title {String}
 * job.link {String}
 * job.location {String}
 * job.spent {String}
 * job.skills {Object[]}
 * job.paidInfo {String}
 */