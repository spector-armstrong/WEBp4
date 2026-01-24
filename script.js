const weather_url = "api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt=7&appid=ab9f0f072573993b4aa1e8ce4c031d19"

let cityInfo = []


async function GetWeather(url) {

    document.querySelector(".search-btn").addEventListener("click", function () {
        let cityStr = document.querySelector("#city-search").value;
        if (cityStr && (cityStr.slice(-3, -2) === ",")) {
            cityInfo.push(cityStr.split(","));
        } else {
            alert("Input is incorrect");
        };
    })


    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInfo[0]},${cityInfo[1]}&limit=1&appid=ab9f0f072573993b4aa1e8ce4c031d19`);

        if (response.status !== 200) {
            throw new Error(response.error)};
            
        const responseJson = await response.json();
        console.log(responseJson);

        const meals = responseJson.meals;
        console.log(meals);

        for (let meal of meals) {
            const extResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const extResponseJson = await extResponse.json();
            const innerMeals = extResponseJson.meals;
            // console.log(innerMeals[0].strMeal);
            extended.push({
                recipe: innerMeals[0].strMeal,
                skill: innerMeals[0].strInstructions.length,
                image: innerMeals[0].strMealThumb
            });
        };
        
        meals.forEach((result) => {
            const card = document.createElement('div');
            card.classList = 'card-body';

            const content = `
                    <div class="card">
                        <img src="${result.strMealThumb}" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-title">${result.strMeal}</h4>
                            <p class="card-text">Click on this card to find the recipe for ${result.strMeal}.</p>
                            <p class="card-author">By <a href=profile.html>Venus</a></p>
                        </div>
                    </div>
            `;

            container.innerHTML += content;
        });

        const extAZSorted = extended.toSorted((a, b) => {
                const nameA = a.recipe;
                const nameB = b.recipe;
                return nameA.localeCompare(nameB);
            });
        console.log(extAZSorted);

        const extZASorted = extended.toSorted((a, b) => {
                const nameA = a.recipe;
                const nameB = b.recipe;
                return nameB.localeCompare(nameA);
            });
        console.log(extZASorted);
        
        const extNumSorted = extended.toSorted((a, b) => a.skill - b.skill);


        document.querySelector(".sortAZ").addEventListener("click", function () {
            container.innerHTML = '';
            extAZSorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';
                
                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        document.querySelector(".sortZA").addEventListener("click", function () {
            container.innerHTML = '';
            extZASorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';

                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        document.querySelector(".skill").addEventListener("click", function () {
            container.innerHTML = '';
            extNumSorted.forEach((recipe) => {
                const newCard = document.createElement('div');
                newCard.classList = 'card-body';
                
                const content = `
                        <div class="card">
                            <img src="${recipe.image}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-title">${recipe.recipe}</h4>
                                <p class="card-text">Click on this card to find the recipe for ${recipe.recipe}.</p>
                                <p class="card-author">By <a href=profile.html>Venus</a></p>
                            </div>
                        </div>
                `;

                container.innerHTML += content;
            })
        });

        console.log(extended);
        return extended;
    } catch (error) {
            console.error(`Caught error ${error}`)
    };
};

getItems(foodApi);
