const axios = require('axios');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');
require('dotenv/config');

async function main(gistId, githubToken, user, gistTitle) {

    if (!user || !gistId || !githubToken) {
        console.log('Invalid configuration! To know more: https://github.com/facalz-npm/mdl-watching-box#readme');
        return process.exit(1);
    };

    if (!gistTitle) gistTitle = '📺 Currently Watching | MyDramalist';

    const octokit = new Octokit({
        auth: `token ${githubToken}`
    });

    async function updateGist(lines, desc) {
        let gist;
        try {
            gist = await octokit.gists.get({
                gist_id: gistId
            });
        } catch (error) {
            console.error(`Unable to get gist\n${error}`);
        };

        const filename = Object.keys(gist.data.files)[0];

        try {
            await octokit.gists.update({
                gist_id: gistId,
                files: {
                    [filename]: {
                        filename: desc,
                        content: lines
                    }
                }
            });
        } catch (error) {
            console.error(`Unable to update gist\n${error}`);
        };
    };

    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
    };

    var id = [],
        title = [],
        country = [],
        year = [],
        type = [],
        progess = [],
        lines = [];

    var countries = {
        'South Korea': 'KR',
        'Japan': 'JP',
        'China': 'CN',
        'Taiwan': 'TW',
        'Hong Kong': 'HK',
        'Thailand': 'TH',
        'Philippines': 'PH'
    };

    async function scrap(user) {
        const data = await axios.get('https://mydramalist.com/dramalist/' + user).then((res) => res.data);
        const $ = cheerio.load(data);

        $('#content_1 tr').each((i, elem) => {
            id.push($(elem).find('th:nth-child(1)').text());
            title.push($(elem).find('.mdl-style-col-title>.title span').text());
            country.push($(elem).find('td:nth-child(3)').text());
            year.push($(elem).find('td:nth-child(4)').text());
            type.push($(elem).find('td:nth-child(5)').text());
            progess.push($(elem).find('td:nth-child(7)').text());
        });

        for (let i = 0; i < id.length; i++) {
            country[i] = countries[country[i]];
            year[i] = `(${year[i]})`;
            type[i] = type[i].replace('Drama Special', 'Drama S.');

            lines.push(`${truncate(title[i], 33).padEnd(33)} ${year[i]} ${type[i].padStart(8)} ${progess[i].padStart(9)}`);
        };

        return lines.join('\n');
    };

    try {
        var data = await scrap(user);
        if (!data) data = 'Nothing around here...'
        updateGist(data, gistTitle);
        console.log(data)
    } catch (error) {
        console.log('Invalid user!');
    };
};

module.exports = main;