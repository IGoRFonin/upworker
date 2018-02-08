const puppeteer = require('puppeteer');
const loginSelector = '#login_username';
const passwordSelector = '#login_password';
const submitSelector = '#main-auth-card [type="submit"]';
const jobSelectors = {
    title: '[data-job-title] a',
    location: '.client-location',
    spent: '.client-spendings strong',
    skills: '.o-tag-skill span',
    paidInfo: 'small.text-muted.display-inline-block.m-sm-top'
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
        return Promise.resolve();
    });
    await page.waitFor(500);
    console.log('page open');
    const jobData = await page.evaluate(frontGetData, frontSelectors);
    console.log(jobData);
    // await browser.close();
})();


/**
 * return Object
 */
const frontGetData = frontSelectors => {
    const jobsSelector = '#feed-jobs section';
    const jobs = document.querySelectorAll(jobsSelector);

    const data = [].slice.call(jobs).map(parseJobs);

    return Promise.resolve(data);
}

const parseJobs = section => {
    const job = {};
    job.title = document.querySelector(frontSelectors.title).textContent;
    job.link = document.querySelector(frontSelectors.title).href;
    job.id = getId(job.link);
    job.location = document.querySelector(frontSelectors.location).textContent;
    job.spent = document.querySelector(frontSelectors.spent).textContent;
    job.skills = getSkills(document.querySelectorAll(frontSelectors.skills));
    job.paidInfo = document.querySelector(frontSelectors.paidInfo).textContent.replace(/\s+/g, ' ').trim();
    return job;
}

const getId = href => {
    const clip = href.substr(1, href.length - 2);
    const clipList = clip.split('/');
    return clipList[clipList.length - 1];
}

const getSkills = nodes => [].slice.call(nodes).map(node => node.textContent);

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