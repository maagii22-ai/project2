import React, { useState, useContext, createContext } from "react";
import { motion } from "framer-motion";

// Create Context
const MealContext = createContext();

const translations = {
  en: {
    headerTitle: "Find Meals For Your Ingredients",
    headerSubtitle: "Real food doesn't have ingredients, real food is ingredients.",
    headerQuoteAuthor: "- Jamie Oliver",
    placeholder: "Enter an ingredient",
    searchButton: "Search",
    noMeals: "No meals found. Try another ingredient!",
    searchResults: "Your Search Results:",
    category: "Category:",
    instructions: "Instructions:",
    watchVideo: "Watch Video",
    vegetarianFilter: "Vegetarian",
  },
  mn: {
    headerTitle: "Орцоо олоод хоол хийнэ үү",
    headerSubtitle: "Жинхэнэ хоолонд орц байдаггүй, жинхэнэ хоол нь өөрөө орц юм.",
    headerQuoteAuthor: "- Жэйми Оливер",
    placeholder: "Орцоо оруулна уу",
    searchButton: "Хайх",
    noMeals: "Хоол олдсонгүй. Өөр орц оруулаад дахин оролдоно уу!",
    searchResults: "Таны хайлтын үр дүн:",
    category: "Төрөл:",
    instructions: "Заавар:",
    watchVideo: "Видео үзэх",
    vegetarianFilter: "Цагаан хоол",
  },
};

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
    style={{
      margin: "auto",
      display: "block",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      backgroundSize: "cover",
      backgroundImage:
        "url('https://as1.ftcdn.net/v2/jpg/02/34/24/14/1000_F_234241470_ri1Vlb29cMT6tJsxesZs97aub4LKX5AF.jpg')",
    }}
  />
);

const App = () => {
  const [language, setLanguage] = useState("en");
  const [searchInput, setSearchInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const fetchMeals = async () => {
    if (!searchInput && !isVegetarian) return;

    setIsLoading(true);

    try {
      const vegetarianEndpoint = isVegetarian
        ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`
        : null;
      const ingredientEndpoint = searchInput
        ? `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`
        : null;

      const response = await fetch(
        vegetarianEndpoint || ingredientEndpoint
      );
      const data = await response.json();

      if (isVegetarian && searchInput) {
        const filteredMeals = data.meals?.filter((meal) =>
          meal.strMeal.toLowerCase().includes(searchInput.toLowerCase())
        );
        setMeals(filteredMeals || []);
      } else {
        setMeals(data.meals || []);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = (meal) => {
    if (!favorites.some((fav) => fav.idMeal === meal.idMeal)) {
      setFavorites([...favorites, meal]);
    }
  };

  const removeFromFavorites = (mealId) => {
    setFavorites(favorites.filter((meal) => meal.idMeal !== mealId));
  };

  const t = translations[language];

  return (
    <MealContext.Provider
      value={{
        searchInput,
        setSearchInput,
        meals,
        fetchMeals,
        selectedMeal,
        setSelectedMeal,
        language,
        setLanguage,
        isVegetarian,
        setIsVegetarian,
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      <div className="min-h-screen w-screen flex flex-col bg-gray-100 text-gray-800">
        <Header />
        <Main />
      </div>
    </MealContext.Provider>
  );
};

const Header = () => {
  const {
    searchInput,
    setSearchInput,
    fetchMeals,
    language,
    setLanguage,
    isVegetarian,
    setIsVegetarian,
    favorites,
    setSelectedMeal,
  } = useContext(MealContext);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "mn" : "en");
  };

  const t = translations[language];

  return (
    <header
      className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white p-6 text-center sticky top-0 shadow-lg w-full h-400 relative"
      style={{
        backgroundImage:
          "url('https://media.gettyimages.com/id/1278940460/photo/vegan-food-backgrounds-large-group-of-fruits-vegetables-cereals-and-spices-shot-from-above.jpg?s=2048x2048&w=gi&k=20&c=7DINTFeW0uRQv1el21iPiKOWkHOU2NmQjuXYNQCzmYI=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mb-4"
          >
            <h1 className="text-3xl font-bold">{t.headerTitle}</h1>
          </motion.div>
          <blockquote className="mt-2 italic">
            {t.headerSubtitle}
            <cite className="block mt-1">{t.headerQuoteAuthor}</cite>
          </blockquote>
        </div>
        <div className="flex gap-4">
          <button
            className={`py-2 px-4 rounded-full shadow-lg ${isVegetarian
              ? "bg-green-600 text-white"
              : "bg-black hover:bg-black-500 text-white"
              }`}
            onClick={() => {
              setIsVegetarian(!isVegetarian);
              fetchMeals();
            }}
          >
            {t.vegetarianFilter}
          </button>
          <button
            className="bg-black hover:bg-black-500 text-white py-2 px-4 rounded-full shadow-lg"
            onClick={() => setSelectedMeal(null)}
          >
            {`❤️ ${favorites.length}`}
          </button>
          <button
            onClick={toggleLanguage}
            className="bg-black hover:bg-black-500 text-white py-2 px-4 rounded-full shadow-lg"
          >
            {language === "en" ? "Монгол" : "English"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <input
          type="text"
          className="p-3 w-80 rounded-full border border-gray-300 focus:ring-2 focus:ring-dark text-black transition duration-300 shadow-md"
          placeholder={t.placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={fetchMeals}
          className="bg-black hover:bg-black-500 text-white py-2 px-6 rounded-full shadow-lg transition duration-300"
        >
          {t.searchButton}
        </button>
      </div>
    </header>
  );
};

const Main = () => {
  const { meals, selectedMeal, setSelectedMeal, language, favorites } = useContext(MealContext);
  const t = translations[language];

  return (
    <main className="flex-1 p-6 overflow-auto w-full">
      {selectedMeal ? (
        <MealDetails details={selectedMeal} />
      ) : meals.length > 0 ? (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t.searchResults}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                setSelectedMeal={setSelectedMeal}
              />
            ))}
          </div>
        </section>
      ) : (
        <LoadingSpinner />
      )}

      <Favorites />
    </main>
  );
};

const MealCard = ({ meal, setSelectedMeal }) => {
  const { addToFavorites } = useContext(MealContext);

  const fetchMealDetails = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setSelectedMeal(data.meals[0]);
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => fetchMealDetails(meal.idMeal)}
    >
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full rounded-lg shadow-md mb-4"
      />
      <h3 className="text-lg font-semibold">{meal.strMeal}</h3>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToFavorites(meal);
        }}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md"
      >
        ❤️
      </button>
    </motion.div>
  );
};

const MealDetails = ({ details }) => {
  const { language, setSelectedMeal } = useContext(MealContext);
  const t = translations[language];

  // Extract ingredients
  const ingredients = Object.keys(details)
    .filter((key) => key.startsWith("strIngredient") && details[key])
    .map((key) => details[key]);

  // Extract video ID if available
  const videoUrl = details.strYoutube;
  const videoId = videoUrl ? videoUrl.split("v=")[1].split("&")[0] : null;

  const renderIngredients = () => (
    <div className="mb-6">
      <h3 className="text-2xl font-semibold mb-2">{t.placeholder}</h3>
      <ul className="list-disc list-inside">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );

  const renderVideo = () => {
    if (videoId) {
      return (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">{t.watchVideo}</h3>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 bg-white shadow-xl rounded-lg p-8 text-left relative">
      <button
        onClick={() => setSelectedMeal(null)}
        className="fixed top-6 left-6 bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 z-50"
      >
        ← {t.searchButton}
      </button>

      <div className="text-center mb-8">
        <img
          src={details.strMealThumb}
          alt={details.strMeal}
          className="w-2/3 max-w-lg mx-auto rounded-xl shadow-lg mb-6"
        />
        <h2 className="text-4xl font-semibold text-gray-800">{details.strMeal}</h2>
      </div>

      <p className="text-lg text-gray-700 mb-6">
        <strong>{t.category}: </strong>{details.strCategory}
      </p>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">{t.instructions}</h3>
        <p>{details.strInstructions}</p>
      </div>

      {ingredients.length > 0 && renderIngredients()}
      {renderVideo()}
    </div>
  );
};

const Favorites = () => {
  const { favorites, setSelectedMeal, language } = useContext(MealContext);
  const t = translations[language];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{t.searchResults}</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              setSelectedMeal={setSelectedMeal}
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-center">{t.noMeals}</p>
      )}
    </section>
  );
};

export default App;
