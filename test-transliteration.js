// Simple test script for Transliteration API
// If Node version is < 18, this might fail. We'll assume Node 18+.

async function transliterate(word, numSuggestions = 5) {
    if (!word || !word.trim()) return [];
    console.log(`Transliterating: "${word}"...`);

    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=hi-t-i0-und&num=${numSuggestions}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
            return data[1][0][1];
        }
        return [word];
    } catch (error) {
        console.error("Transliteration error:", error);
        return [word];
    }
}

async function runTest() {
    const testWords = ['namaste', 'kahani', 'duniya', 'kya haal hai'];

    for (const word of testWords) {
        const suggestions = await transliterate(word);
        console.log(`Input: ${word} => Output: ${suggestions[0]} (All: ${suggestions.join(', ')})`);
    }
}

runTest();
