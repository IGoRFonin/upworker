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
    title: '.job-title a',
    location: '.client-location',
    spent: '.client-spendings strong',
    skills: '.o-tag-skill span',
    paidInfo: 'small.text-muted.display-inline-block.m-sm-top',
    description: '.description span[data-ng-show="isOpen"] span'
};
const newerSelector = '.load-newer-button';

mongoose.connect(env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});

const newerData = async page => {
    await page.waitForSelector(jobSelectors.jobListSelector);;
    try {
    const jobData = await page.evaluate(getJobs, jobSelectors);
    await addJobsToDb(jobData);
    } catch (e) {
        console.log(e);
    }
    setTimeout(async () => {
        await page.reload();
        console.log('newer Data');
        newerData(page);
    }, 60000 * 5)
}

(async () => {
    const browser = await puppeteer.launch({ devtools: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    await page.goto(env.URL);
    await page.waitFor(2*1000);
    console.log('login type');
    await page.type(loginSelector, env.LOGIN);
    await page.click(submitSelector);
    await page.waitFor(1000);
    console.log('pass type');
    await page.type(passwordSelector, env.PASSWORD);
    await page.waitFor(500);
    await page.evaluate(clickLogin);
    await newerData(page);
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