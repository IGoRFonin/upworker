/**
 * return Object
 */
module.exports = frontSelectors => {
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