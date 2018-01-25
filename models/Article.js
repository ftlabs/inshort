const striptags = require('striptags');
//CONSTANT VARS
const AVERAGE_READ_TIME = 200;

/**
 * Article object, used by various modules for article representation.
 */
class Article {

    constructor(id, title, standfirst, genre, firstPublishedDate, url, byline, type, annotations, content, 
        imageUrl = null, summary = null) {
            this.id = id;
            this.title = title;
            this.standfirst = standfirst;
            this.genre = genre;
            this.firstPublishedDate = firstPublishedDate;
            this.url = url;
            this.byline = byline;
            this.type = type;
            this.annotations = annotations;
            this.content = content;
            this.imageUrl = imageUrl;
            this.summary = summary;
    }

    /**
     * Returns a list containg each word within the articles content.
     */
    get contentTokens() {
        const text = striptags(this.content).replace(/(\r\n|\n|\r)/gm, "");   
        return text.split(" ");     
    }

    /**
     * Generates reading statistics for the current article.
     */
    generateStatistics() {
        const contentWordCount = this.content.split(" ").length;
        const summaryWordCount = this.summary.split(" ").length;
        if(contentWordCount <= 0 || summaryWordCount <= 0 ) {
            throw new Error("Unable to generate statistics for Article without summary content")
        }
        const deduction = ((contentWordCount - summaryWordCount) / contentWordCount) * 100;
        const readTime = Math.round(contentWordCount / AVERAGE_READ_TIME);
        let summaryReadTime = Math.round(summaryWordCount / AVERAGE_READ_TIME);
        if (summaryReadTime < 1)
            summaryReadTime = "Less than a"
        this['reading_time'] = `${readTime} Minutes`;
        this['summary_reading_time'] = `${summaryReadTime} minute`;
        this['deduction'] = `${Math.round(deduction)}%`;
    }
}

module.exports = Article;

