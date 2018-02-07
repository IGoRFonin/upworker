const puppeteer = require('puppeteer');
const loginSelector = '#login_username';
const passwordSelector = '#login_password';
const submitSelector = '#main-auth-card [type="submit"]';
const jobSelectors = {
    title: '[data-job-title] a',
    location: '.client-location',
    spent: '.client-spendings strong',
    skills: '.o-tag-skill'
};


(async () => {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    await page.goto('xxx');
    await page.type(loginSelector, 'xxx');
    await page.click(submitSelector);
    await page.waitFor(500);
    await page.type(passwordSelector, 'xxx');
    await page.waitFor(500);
    await page.evaluate(() => {
        const buttons = document.querySelectorAll('#main-auth-card [type="submit"]');
        [].slice.call(buttons).reduce((acc, button) => {
            if (button.offsetParent !== null) {
                button.click();
            }
        });
        console.log(submitSelector);
        return Promise.resolve();
    });
    await page.waitFor(300);


    console.log('page open')
    // await browser.close();
})();


/**
 * return Object
 */
const frontGetData = frontSelectors => {
    const jobsSelector = '#feed-jobs section';
    const jobs = document.querySelectorAll(jobsSelector);

    const data = [].slice.call(jobs).map(parseJobs);
}

const parseJobs = section => {
    const job = {};
    job.title = document.querySelector(frontSelectors.title).textContent;
    job.location = document.querySelector(frontSelectors.location).textContent;
    job.spent = document.querySelector(frontSelectors.spent).textContent;
}