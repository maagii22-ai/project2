import React, { useContext } from "react";
import { MealContext } from "./App";
import { useNavigate } from "react-router-dom";
import translations from "./translations";

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
    } = useContext(MealContext);
    const navigate = useNavigate();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "mn" : "en");
    };

    const t = translations[language];

    return (
        <header className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white p-6 text-center sticky top-0 shadow-lg w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t.headerTitle}</h1>
                <div className="flex gap-4">
                    <button
                        className={`py-2 px-4 rounded-full shadow-lg ${isVegetarian ? "bg-green-600" : "bg-black"
                            }`}
                        onClick={() => {
                            setIsVegetarian(!isVegetarian);
                            fetchMeals();
                        }}
                    >
                        {t.vegetarianFilter}
                    </button>
                    <button
                        onClick={() => navigate("/favorites")}
                        className="bg-black text-white py-2 px-4 rounded-full shadow-lg"
                    >
                        ❤️ {favorites.length}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="bg-black text-white py-2 px-4 rounded-full shadow-lg"
                    >
                        {language === "en" ? "Монгол" : "English"}
                    </button>
                </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
                <input
                    type="text"
                    className="p-3 w-80 rounded-full border"
                    placeholder={t.placeholder}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                    onClick={fetchMeals}
                    className="bg-black text-white py-2 px-6 rounded-full shadow-lg"
                >
                    {t.searchButton}
                </button>
            </div>
        </header>
    );
};

export default Header;
