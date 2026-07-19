# Validation script for Scouter model predictions

from train_model import predict_food, train_scouter_model
from food_database import FOOD_DATABASE

def validate():
    print("Starting verification validation test...")
    # Verify that model exists or train it
    train_scouter_model(epochs=35)
    
    test_cases = {
        "chicken": "Chicken Breast (Cooked)",
        "chicken breast": "Chicken Breast (Cooked)",
        "boiled chicken": "Chicken Breast (Cooked)",
        "chicken thigh": "Chicken Thigh (Cooked)",
        "chicken curry": "Chicken Curry",
        "chicken tikka": "Chicken Tikka Masala",
        "butter chicken": "Chicken Tikka Masala",
        "roasted chicken": "Chichi's Roasted Chicken",
        "paneer": "Cottage Cheese (Paneer)",
        "paneer curry": "Paneer Curry",
        "paneer butter": "Paneer Butter Masala",
        "dal": "Lentils (Dal, Cooked)",
        "dal makhani": "Dal Makhani",
        "roti": "Whole Wheat Roti / Chapati",
        "chapati": "Whole Wheat Roti / Chapati",
        "naan": "Butter Naan",
        "biryani": "Vegetable Biryani",
        "fried rice": "Saiyan Fried Rice",
        "egg": "Egg (Boiled)",
        "boiled egg": "Egg (Boiled)",
        "banana": "Banana",
        "apple": "Apple"
    }
    
    passed = 0
    failed = 0
    
    for query, expected in test_cases.items():
        pred = predict_food(query)
        if pred == expected:
            print(f"[PASS] Query '{query}' -> Predicted: '{pred}'")
            passed += 1
        else:
            print(f"[FAIL] Query '{query}' -> Expected: '{expected}', Got: '{pred}'")
            failed += 1
            
    print(f"\nVerification Results: {passed} passed, {failed} failed.")
    assert failed == 0, "Model did not classify all test cases perfectly!"
    print("ALL TESTS PASSED! Scouter Model classifies queries perfectly!")

if __name__ == "__main__":
    validate()
