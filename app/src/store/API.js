const BASE_URL = "/summary";

export default class API {

    fetch(id, summaryMethod, extractiveData) {
        const returnMethod = null
        switch (summaryMethod) {
            case "sentence": return this.firstSentenceSummary(id)
            case "extractive": return this.extractiveSummary(id, extractiveData);
        }
    }

    fetchTimeline(searchTerm, beforeDate, afterDate) {
        beforeDate = beforeDate.split('-');
        beforeDate = `${beforeDate[2]}-${beforeDate[1]}-${beforeDate[0]}` //Convert to uk format
        afterDate = afterDate.split('-')
        afterDate = `${afterDate[2]}-${afterDate[1]}-${afterDate[0]}`
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

} 