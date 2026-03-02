const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderSection = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    try {
        // Reseting UI
        errorMessage.classList.add("hidden");
        countryInfo.classList.add("hidden");
        borderSection.classList.add("hidden");
        spinner.classList.remove("hidden");

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Displaying country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        countryInfo.classList.remove("hidden");

        // Handling bordering countries
        borderSection.innerHTML = "";

        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                    <div class="border-country">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="80">
                    </div>
                `;
            }
        } else {
            borderSection.innerHTML = "<p>No bordering countries.</p>";
        }

        borderSection.classList.remove("hidden");

    } catch (error) {
        errorMessage.textContent = "Country not found. Please try again.";
        errorMessage.classList.remove("hidden");
    } finally {
        spinner.classList.add("hidden");
    }
}

//Even listeners
// Clicking search
button.addEventListener("click", () => {
    const country = input.value.trim();
    if (country !== "") {
        searchCountry(country);
    }
});

// Clicking enter button
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const country = input.value.trim();
        if (country !== "") {
            searchCountry(country);
        }
    }
});
