import React, { useContext } from "react";
import { MealContext } from "./App";
import translations from "./translations";
import Header from "./header";
import LoadingSpinner from "./LoadingSpinner";
import MealDetails from "./MealDetails";
import MealCard from "./MealCard";

const HomePage = () => {
    const { meals, selectedMeal, setSelectedMeal, language } = useContext(MealContext);
    const t = translations[language];

    return (
        <div className="min-h-screen w-screen flex flex-col bg-gray-100 text-gray-800">
            <Header />
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
            </main>
        </div>
    );
};

export default HomePage;
