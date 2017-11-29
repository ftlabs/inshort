const BASE_URL = "/summary/";

export default class API {

    fetch(id, summaryMethod, extractiveData) {
        const returnMethod = null
        switch (summaryMethod) {
            case "sentence": return this.firstSentenceSummary(id)
            case "extractive": return this.extractiveSummary(id, extractiveData);
        }
    }

    firstSentenceSummary(id) {
        let urlComponent = encodeURIComponent(id);
        let url = `${BASE_URL}/first-sentence/${urlComponent}`;        
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    extractiveSummary(id, extractiveData) {
        console.log(extractiveData)
        let urlComponent = encodeURIComponent(id);
        const algorithm = extractiveData.algorithm;
        const lines = extractiveData.lines != "" ? extractiveData.lines : 5;
        let url = `${BASE_URL}/extractive/${urlComponent}?lines=${lines}&algorithm=${algorithm}`;    
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

} 