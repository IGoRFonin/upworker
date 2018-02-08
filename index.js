const puppeteer = require('puppeteer');
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


(async () => {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    await page.goto(env.URL);
    await page.type(loginSelector, env.LOGIN);
    await page.click(submitSelector);
    await page.waitFor(500);
    await page.type(passwordSelector, env.PASSWORD);
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
    await page.waitForSelector(jobSelectors.jobListSelector);
    console.log('page open');
    const jobData = await page.evaluate(frontGetData, jobSelectors);
    console.log(jobData);
    // await browser.close();
})();


/**
 * return Object
 */
const frontGetData = frontSelectors => {
    console.log(frontSelectors);
    const jobs = document.querySelectorAll(frontSelectors.jobListSelector);
    const parseJobs = section => {
        const job = {};
        job.title = section.querySelector(frontSelectors.title).textContent;
        job.link = section.querySelector(frontSelectors.title).href;
        job.id = getId(job.link);
        job.location = section.querySelector(frontSelectors.location).textContent;
        job.spent = section.querySelector(frontSelectors.spent).textContent;
        job.skills = getSkills(section.querySelectorAll(frontSelectors.skills));
        job.paidInfo = section.querySelector(frontSelectors.paidInfo).textContent.replace(/\s+/g, ' ').trim();
        return job;
    }
    const getId = href => {
        const clip = href.substr(1, href.length - 2);
        const clipList = clip.split('/');
        return clipList[clipList.length - 1];
    }
    const getSkills = nodes => [].slice.call(nodes).map(node => node.textContent);

    const data = [].slice.call(jobs).map(parseJobs);

    return Promise.resolve(data);
}

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