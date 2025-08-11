let quotes = [
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

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<em>No quotes available.</em>";
        return;
    }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `
        "${randomQuote.text}"
        <span class="category">— ${randomQuote.category}</span>
    `;
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both the quote and its category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  document.getElementById("quoteDisplay").innerHTML = `
    "${newQuoteText}"
    <span class="category">— ${newQuoteCategory}</span>
  `;

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

showRandomQuote();
