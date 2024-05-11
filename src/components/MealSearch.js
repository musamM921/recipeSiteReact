import React, { useState } from 'react';

const MealSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [meals, setMeals] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipeDetails, setRecipeDetails] = useState(null); // Состояние для хранения деталей рецепта

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`);
      const data = await response.json();
      if (data.meals) {
        setMeals(data.meals);
        setErrorMessage('');
        setRecipeDetails(null); // Очистить детали рецепта при новом поиске
      } else {
        setMeals([]);
        setErrorMessage('Sorry, we didn\'t find any meals.');
        setRecipeDetails(null); // Очистить детали рецепта при ошибке
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMeals([]);
      setErrorMessage('Something went wrong. Please try again.');
      setRecipeDetails(null); // Очистить детали рецепта при ошибке
    }
  };

  const handleRecipeClick = async (mealId) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        const recipeDetails = {
          title: meal.strMeal,
          category: meal.strCategory,
          instructions: meal.strInstructions,
          image: meal.strMealThumb,
          video: meal.strYoutube
        };
        setErrorMessage('');
        setMeals([]);
        setRecipeDetails(recipeDetails); // Установить детали рецепта в состояние
      } else {
        setErrorMessage('Recipe not found.');
        setRecipeDetails(null); // Очистить детали рецепта при ошибке
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setErrorMessage('Failed to fetch recipe details. Please try again.');
      setRecipeDetails(null); // Очистить детали рецепта при ошибке
    }
  };

  return (
    <div className="meal-wrapper">
      <div className="meal-search">
        <h2 className="title">Find Meals For Your Ingredients</h2>
        <div className="meal-search-box">
          <input
            type="text"
            className="search-control"
            placeholder="Enter an ingredient"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-btn btn" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
      </div>

      <div className="meal-result">
        <h2 className="title">Your Search Results:</h2>
        <div id="meal">
          {meals.map((meal) => (
            <div key={meal.idMeal} className="meal-item">
              <div className="meal-img">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
              </div>
              <div className="meal-name">
                <h3>{meal.strMeal}</h3>
                <button className="recipe-btn" onClick={() => handleRecipeClick(meal.idMeal)}>Get Recipe</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {recipeDetails && ( // Отображение деталей рецепта, если они есть
        <div className="recipe-details">
          <h2 className="recipe-title">{recipeDetails.title}</h2>
          <p className="recipe-category">{recipeDetails.category}</p>
          <div className="recipe-instruct">
            <h3>Instructions:</h3>
            <p>{recipeDetails.instructions}</p>
          </div>
          <div className="recipe-meal-img">
            <img src={recipeDetails.image} alt={recipeDetails.title} />
          </div>
          <div className="recipe-link">
            <a href={recipeDetails.video} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSearch;
