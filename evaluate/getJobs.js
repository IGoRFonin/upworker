/**
 * return Object
 */
module.exports = frontSelectors => {
    const jobs = document.querySelectorAll(frontSelectors.jobListSelector);
    const parseJobs = section => {
        const job = {};
        job.title = getText(section.querySelector(frontSelectors.title));
        job.link = section.querySelector(frontSelectors.title).href;
        job.id = getId(job.link);
        job.location = getText(section.querySelector(frontSelectors.location));
        job.description = getText(section.querySelector(frontSelectors.description));
        job.spent = getText(section.querySelector(frontSelectors.spent));
        job.skills = getSkills(section.querySelectorAll(frontSelectors.skills));
        job.paidInfo = getText(section.querySelector(frontSelectors.paidInfo)).replace(/\s+/g, ' ').trim();
        return job;
    }
    const getId = href => {
        const clip = href.substr(1, href.length - 2);
        const clipList = clip.split('/');
        return clipList[clipList.length - 1];
    }
    const getSkills = nodes => [].slice.call(nodes).map(node => node.textContent);
    const getText = elem => elem ? elem.textContent : '';
    const data = [].slice.call(jobs).map(parseJobs);

    return Promise.resolve(data);
}