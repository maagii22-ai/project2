import React, { useContext } from "react";
import { MealContext } from "./App";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
    const { favorites, setSelectedMeal } = useContext(MealContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
            <button
                onClick={() => navigate(-1)}
                className="bg-orange-600 text-white py-2 px-4 rounded-lg mb-6"
            >
                ← Back
            </button>
            <h1 className="text-2xl font-semibold mb-4">Your Favorites</h1>
            {favorites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((meal) => (
                        <div
                            key={meal.idMeal}
                            className="bg-white shadow-lg rounded-xl p-6 text-center relative"
                            onClick={() => setSelectedMeal(meal)}
                        >
                            <img
                                src={meal.strMealThumb}
                                alt={meal.strMeal}
                                className="w-full rounded-lg shadow-md mb-4"
                            />
                            <h3 className="text-lg font-semibold">{meal.strMeal}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
