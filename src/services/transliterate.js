/**
 * Fetches Hindi transliteration suggestions for a given Hinglish word.
 * Uses Google Input Tools API.
 * 
 * @param {string} word - The Hinglish word to transliterate (e.g., "namaste")
 * @param {number} numSuggestions - Number of suggestions to fetch (default 5)
 * @returns {Promise<string[]>} - Array of Hindi suggestions
 */
export async function transliterate(word, numSuggestions = 5) {
    if (!word || !word.trim()) return [];

    // Google Input Tools API endpoint for Hindi (hi-t-i0-und)
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=hi-t-i0-und&num=${numSuggestions}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
            // data[1][0][1] contains the array of suggestions
            return data[1][0][1];
        }
        return [word]; // Fallback to original word if API fails logic
    } catch (error) {
        console.error("Transliteration error:", error);
        return [word]; // Fallback on error
    }
}
