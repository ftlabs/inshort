const BASE_URL = "/summary";
import util from '../util';

export default class API {
    
    /**
     * Generic Fetch for different
     * @param {*} id 
     * @param {*} summaryMethod 
     * @param {*} extractiveData 
     */
    fetch(id, summaryMethod, extractiveData) {
        const returnMethod = null
        switch (summaryMethod) {
            case "sentence": return this.firstSentenceSummary(id)
            case "extractive": return this.extractiveSummary(id, extractiveData);
        }
    }

    fetchTopicSummary(searchTerm, beforeDate, afterDate) {
        beforeDate = util.convertToUkDate(beforeDate);
        afterDate = util.convertToUkDate(afterDate);
        const url = `/topic/?search=${searchTerm}&before=${beforeDate}&after=${afterDate}`
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    fetchInfographicSummary(searchTerm, beforeDate, afterDate) {
        beforeDate = util.convertToUkDate(beforeDate);
        afterDate = util.convertToUkDate(afterDate);
        const url = `/infographic?search=${searchTerm}&before=${beforeDate}&after=${afterDate}`
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    fetchTopicImageSummary(searchTerm, beforeDate, afterDate) {
        beforeDate = util.convertToUkDate(beforeDate);
        afterDate = util.convertToUkDate(afterDate);
        const url = `/topic/image?search=${searchTerm}&before=${beforeDate}&after=${afterDate}`
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }
    
    fetchTimeline(searchTerm, beforeDate, afterDate) {
        let url = `/timeline?search=${searchTerm}&before=${beforeDate}&after=${afterDate}`
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }


    firstSentenceSummary(id) {
        let urlComponent = encodeURIComponent(id);
        let url = `${BASE_URL}/first-sentence/${urlComponent}`;        
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    extractiveSummary(id, extractiveData) {
        let urlComponent = encodeURIComponent(id);
        const algorithm = extractiveData.algorithm;
        const lines = extractiveData.lines != "" ? extractiveData.lines : 5;
        let url = `${BASE_URL}/extractive/${urlComponent}?lines=${lines}&algorithm=${algorithm}`;    
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    wikipediaSummary(title) {
        let urlComponent = encodeURIComponent(title);  
        let url = `topic/wikipedia?search=${urlComponent}`;
        return fetch(url).then(resp => resp.json());
    }

} 