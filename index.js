const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs");
const { gzip } = require("zlib");
const json2csv = require("json2csv").Parser;

const movies = ["https://www.imdb.com/title/tt2616620/?ref_=nm_knf_i1",
    "https://www.imdb.com/title/tt5325878/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt6387472/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt7415646/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt7968456/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt3046014/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt9315438/?ref_=tt_sims_tti"];

(async () => {
    let imdbData = []
    for (let movie of movies) {
        const response = await request({
            uri: movie,
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9,kn;q=0.8",
            },
            gzip: true
        });
        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('div[class="ratingValue"] > strong > span').text()
        let summary = $('div[class="summary_text"]').text().trim()
        let releaseDate = $('a[title="See more release dates"]').text().trim()

        imdbData.push({
            title, rating, summary, releaseDate
        });
    }
    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData)

    fs.writeFileSync("./imdb", csv, "utf-8")
}
)()