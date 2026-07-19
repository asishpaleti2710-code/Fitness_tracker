import https from 'https';

const url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=peanut+butter&search_simple=1&action=process&json=1&page_size=1";

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.products && json.products.length > 0) {
                console.log(JSON.stringify(json.products[0], null, 2));
            } else {
                console.log("No products found");
            }
        } catch (e) {
            console.error("Error parsing JSON", e);
        }
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
