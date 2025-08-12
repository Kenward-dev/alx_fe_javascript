let quotes = [];

function loadQuotes() {
    const stored = localStorage.getItem("quotes");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            quotes = Array.isArray(parsed) ? parsed : [];
        } catch {
            quotes = [];
        }
    } else {
        quotes = [
            { text: "No matter how long the night, the day will surely break.", category: "Proverb" },
            { text: "When the roots of a tree begin to decay, it spreads death to the branches.", category: "Proverb" },
            { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "Proverb" },
            { text: "When the drumbeat changes, the dance must also change.", category: "Proverb" },
            { text: "Wisdom is like a baobab tree; no one individual can embrace it.", category: "Proverb" },
            { text: "The child who is not embraced by the village will burn it down to feel its warmth.", category: "Proverb" },
            { text: "No food for a lazy man.", category: "Popular Saying" },
            { text: "Cut your coat according to your size.", category: "Popular Saying" },
            { text: "The river that forgets its source will surely dry up.", category: "Proverb" },
            { text: "When the going gets tough, the tough get going.", category: "Motivation" }
        ];
        saveQuotes();
    }
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function getFilteredQuotes() {
    const filter = document.getElementById("categoryFilter");
    if (!filter || filter.value === "all") return quotes;
    return quotes.filter(q => q.category.toLowerCase() === filter.value.toLowerCase());
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return;

    const filtered = getFilteredQuotes();
    if (filtered.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
        return;
    }
    const idx = Math.floor(Math.random() * filtered.length);
    const q = filtered[idx];
    quoteDisplay.innerHTML = `"${q.text}"<span class="category">— ${q.category}</span>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

async function fetchQuotesFromServer(syncStatus) {
    try {
        if (syncStatus) syncStatus.textContent = "Sync status: Fetching quote from server...";
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok) throw new Error("Failed to fetch quote");
        const data = await res.json();

        const post = data[Math.floor(Math.random() * data.length)];
        const category = post.title ? post.title.split(" ")[0] : "Uncategorized";
        const newQuote = { text: post.body, category };

        const exists = quotes.some(q => q.text === newQuote.text && q.category === newQuote.category);
        if (!exists) {
            quotes.push(newQuote);
            saveQuotes();
            populateCategories();
            document.getElementById("quoteDisplay").innerHTML = `"${newQuote.text}"<span class="category">— ${newQuote.category}</span>`;
            sessionStorage.setItem("lastQuote", JSON.stringify(newQuote));
            if (syncStatus) syncStatus.textContent = "Sync status: New quote fetched from server";
        } else {
            if (syncStatus) syncStatus.textContent = "Sync status: No new quote (already have this one)";
        }
    } catch (err) {
        if (syncStatus) syncStatus.textContent = "Sync status: Failed to fetch quote";
        console.error(err);
    } finally {
        setTimeout(() => { if (syncStatus) syncStatus.textContent = "Sync status: Idle"; }, 3000);
    }
}

async function syncQuotes(quote, syncStatus) {
    try {
        if (syncStatus) syncStatus.textContent = "Sync status: Posting new quote to server...";
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
        if (!res.ok) throw new Error("Failed to post quote");
        await res.json();
        if (syncStatus) syncStatus.textContent = "Sync status: Quote posted to server";
    } catch (err) {
        if (syncStatus) syncStatus.textContent = "Sync status: Failed to post quote";
        console.error(err);
    } finally {
        setTimeout(() => { if (syncStatus) syncStatus.textContent = "Sync status: Idle"; }, 3000);
    }
}

function addQuote(syncStatus) {
    const txtEl = document.getElementById("newQuoteText");
    const catEl = document.getElementById("newQuoteCategory");
    if (!txtEl || !catEl) return;
    const txt = txtEl.value.trim();
    const cat = catEl.value.trim();
    if (!txt || !cat) {
        alert("Please enter both the quote and its category.");
        return;
    }
    const newQ = { text: txt, category: cat };
    quotes.push(newQ);
    saveQuotes();
    populateCategories();
    document.getElementById("quoteDisplay").innerHTML = `"${txt}"<span class="category">— ${cat}</span>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(newQ));

    syncQuotes(newQ, syncStatus);

    txtEl.value = "";
    catEl.value = "";
}

function createAddQuoteForm(syncStatus) {
    const container = document.createElement("div");
    container.id = "addQuoteForm";
    const inputText = document.createElement("input");
    inputText.id = "newQuoteText";
    inputText.type = "text";
    inputText.placeholder = "Enter a new quote";
    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.type = "text";
    inputCategory.placeholder = "Enter quote category";
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", () => addQuote(syncStatus));
    container.appendChild(inputText);
    container.appendChild(inputCategory);
    container.appendChild(addButton);
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quoteDisplay && quoteDisplay.parentNode) {
        quoteDisplay.parentNode.insertBefore(container, quoteDisplay);
    } else {
        document.body.appendChild(container);
    }
}

function populateCategories() {
    const selectedCategory = document.getElementById("categoryFilter");
    if (!selectedCategory) return;
    const cats = [...new Set(quotes.map(q => q.category))].sort();
    selectedCategory.innerHTML = `<option value="all">All Categories</option>`;
    cats.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        selectedCategory.appendChild(opt);
    });
}

function filterQuotes() {
    showRandomQuote();
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) throw new Error("Invalid format");
            const filtered = imported
                .filter(item => item && typeof item.text === "string" && typeof item.category === "string")
                .map(item => ({ text: item.text, category: item.category }));
            if (filtered.length === 0) {
                alert("No valid quotes found in the file.");
                return;
            }
            quotes.push(...filtered);
            saveQuotes();
            populateCategories();
            alert("Quotes imported successfully!");
            showRandomQuote();
        } catch {
            alert("Failed to import quotes. Ensure the JSON is an array of {text, category} objects.");
        }
    };
    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
    const syncStatus = document.getElementById("syncStatus");

    loadQuotes();
    createAddQuoteForm(syncStatus);
    populateCategories();

    const btn = document.getElementById("newQuote");
    if (btn) btn.addEventListener("click", showRandomQuote);

    const exportBtn = document.getElementById("exportQuotes");
    if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

    const importEl = document.getElementById("importFile");
    if (importEl) importEl.addEventListener("change", importFromJsonFile);

    const manualSyncBtn = document.getElementById("manualSync");
    if (manualSyncBtn) manualSyncBtn.addEventListener("click", () => fetchQuotesFromServer(syncStatus));

    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        try {
            const q = JSON.parse(last);
            const display = document.getElementById("quoteDisplay");
            if (display) display.innerHTML = `"${q.text}"<span class="category">— ${q.category}</span>`;
        } catch {
            showRandomQuote();
        }
    } else {
        showRandomQuote();
    }

    setInterval(() => {
        fetchQuotesFromServer(syncStatus);
    }, 60000);
});
