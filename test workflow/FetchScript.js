import fs from "fs";
import fetch from "node-fetch";

// Make sure this function exists/import it if it's in another file
function modifyJsonFile(filename) {
    console.log(`Modifying ${filename}...`);
    // your existing logic here
}

const URL = "https://api.echoesofastra.com/getallcards";

async function fetchCards() {
    try {
        console.log(`Fetching cards from ${URL}...`);

        const res = await fetch(URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const cards = data.cards || data.data || data;

        const formatted = {};

        cards.forEach(card => {
            const id = card.id || card.cardId;

            const name = card.name || card.title || "";
            const type = card.type || "";
            const cost = card.cost || "";

            const image =
                card.image ||
                card.imageUrl ||
                card.img ||
                card.images?.large ||
                "";

            formatted[id] = {
                id: id,
                isToken: card.isToken ?? false,
                face: {
                    front: {
                        name: name,
                        type: type,
                        cost: String(cost),
                        image: image,
                        isHorizontal: card.isHorizontal ?? false
                    }
                },
                name: name,
                type: type,
                cost: String(cost)
            };
        });

        // Save file
        fs.writeFileSync("Cardlist.json", JSON.stringify(formatted, null, 2));

        console.log(`✅ Saved ${Object.keys(formatted).length} cards`);

        // 👉 Your added line
        modifyJsonFile("Cardlist.json");

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

fetchCards();