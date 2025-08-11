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

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return;
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available.</em>";
        return;
    }
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const q = quotes[quoteIndex];
    quoteDisplay.innerHTML = `"${q.text}"<span class="category">— ${q.category}</span>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

function addQuote() {
    const quoteText = document.getElementById("newQuoteText");
    const categoryText = document.getElementById("newQuoteCategory");
    if (!quoteText || !categoryText) return;
    const txt = quoteText.value.trim();
    const cat = categoryText.value.trim();
    if (!txt || !cat) {
        alert("Please enter both the quote and its category.");
        return;
    }
    const newQ = { text: txt, category: cat };
    quotes.push(newQ);
    saveQuotes();
    document.getElementById("quoteDisplay").innerHTML = `"${txt}"<span class="category">— ${cat}</span>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(newQ));
    quoteText.value = "";
    categoryText.value = "";
}

function createAddQuoteForm() {
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
    addButton.addEventListener("click", addQuote);
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
    reader.onload = function(e) {
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
        alert("Quotes imported successfully!");
        showRandomQuote();
        } catch {
            alert("Failed to import quotes. Ensure the JSON is an array of {text, category} objects.");
        }
    };
    reader.readAsText(file);
}

loadQuotes();
createAddQuoteForm();
const btn = document.getElementById("newQuote");
if (btn) btn.addEventListener("click", showRandomQuote);
const exportBtn = document.getElementById("exportQuotes");
if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);
const importEl = document.getElementById("importFile");
if (importEl) importEl.addEventListener("change", importFromJsonFile);
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
