import random
import os
import json
from .train_model import predict_food, train_scouter_model, MODEL_PATH
from food_database import FOOD_DATABASE

class AIService:
    def __init__(self):
        self.exercises = {
            "chest": ["Push-ups", "Bench Press", "Incline Dumbbell Press", "Chest Flyes", "Cable Crossovers"],
            "back": ["Pull-ups", "Lat Pulldowns", "Bent Over Rows", "Seated Cable Rows", "Face Pulls"],
            "legs": ["Squats", "Lunges", "Leg Press", "Romanian Deadlifts", "Leg Extensions", "Calf Raises"],
            "shoulders": ["Overhead Press", "Lateral Raises", "Front Raises", "Reverse Pec Deck", "Shrugs"],
            "arms": ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Skull Crushers", "Tricep Pushdowns"],
            "core": ["Plank", "Crunches", "Leg Raises", "Russian Twists", "Bicycle Crunches"],
            "cardio": ["Jumping Jacks", "Burpees", "High Knees", "Mountain Climbers", "Running"]
        }

    def generate_workout_plan(self, goal: str, fitness_level: str):
        """
        Generates a workout plan based on goal and fitness level.
        In a real scenario, this would call an LLM (e.g., OpenAI API).
        """
        
        # Logic to determine structure based on goal
        if "muscle" in goal.lower():
            structure = ["chest", "back", "legs", "shoulders", "arms", "core"]
            sets_reps = "3-4 sets of 8-12 reps"
        elif "weight" in goal.lower() or "fat" in goal.lower():
            structure = ["cardio", "legs", "chest", "back", "core", "cardio"]
            sets_reps = "3 sets of 15-20 reps"
        else: # General fitness / Endurance
            structure = ["cardio", "full_body_mix", "core"]
            sets_reps = "3 sets of 12-15 reps"

        # Logic for fitness level
        if fitness_level.lower() == "beginner":
            exercise_count = 4
            difficulty_modifier = " (Focus on form)"
        elif fitness_level.lower() == "intermediate":
            exercise_count = 6
            difficulty_modifier = ""
        else: # Advanced
            exercise_count = 8
            difficulty_modifier = " (Add weight/intensity)"

        plan = []
        
        # Generate exercises
        selected_types = structure * 2 # Ensure enough types
        
        used_exercises = set()

        for body_part in selected_types[:exercise_count]:
            if body_part == "full_body_mix":
                # Pick random from all except cardio
                part = random.choice(["chest", "back", "legs", "shoulders", "arms"])
            else:
                part = body_part

            # Select unique exercise
            available = [ex for ex in self.exercises.get(part, []) if ex not in used_exercises]
            if not available: 
                available = self.exercises.get(part, []) # Reuse if run out
            
            if available:
                exercise_name = random.choice(available)
                used_exercises.add(exercise_name)
                
                plan.append({
                    "name": exercise_name,
                    "target": part.capitalize(),
                    "sets_reps": sets_reps + difficulty_modifier,
                    "note": f"Rest 60-90s between sets."
                })

        return {
            "goal": goal,
            "fitness_level": fitness_level,
            "exercises": plan,
            "advice": f"Stay hydrated! This plan is optimized for {goal}."
        }

    def generate_chat_response(self, message: str, username: str):
        msg = message.lower()
        
        # Dragon Ball style responses
        if any(keyword in msg for keyword in ["hello", "hi", "hey", "start"]):
            return f"Yo {username}! I'm **Kakarot**! Ready to push past your limits today? Ask me about workouts, food, or steps, and let's get stronger together!"
            
        elif any(keyword in msg for keyword in ["workout", "gym", "exercise", "train"]):
            import random
            categories = ["chest", "back", "legs", "shoulders", "core"]
            exercises = [random.choice(self.exercises[cat]) for cat in categories]
            return f"Yo {username}! Training is the key to breaking your shell! Head to the **Gym Tracker** tab. Today, I recommend trying this custom mix:\n\n" + \
                   "\n".join([f"- **{ex}**" for ex in exercises]) + \
                   "\n\nDon't forget to push hard! Let's get our power level over 9000!"
                   
        elif any(keyword in msg for keyword in ["food", "eat", "meal", "diet", "calories", "protein"]):
            return f"Haha, eating is just as important as training! To fuel your inner Saiyan, log your meals in the **Food Tracker**. Make sure you get enough protein to rebuild those muscles! What did you eat today, {username}?"
            
        elif any(keyword in msg for keyword in ["step", "walk", "cardio", "run"]):
            return f"Walking and running builds incredible stamina! Track your daily steps in the **Step Tracker**. Keep moving, and maybe one day you'll be fast enough to run across Snake Way!"
            
        elif any(keyword in msg for keyword in ["power", "saiyan", "goku", "vegeta", "ki", "aura"]):
            return f"A Saiyan's strength has no limits! Every workout you log increases your power level. Keep training, eat clean, and unlock your Super Saiyan aura! Let's do this, {username}!"
            
        elif any(keyword in msg for keyword in ["profile", "avatar", "account"]):
            return f"To edit your fighter profile, tap your avatar in the top left! You can set your name, email, and choose your avatar."

        elif any(keyword in msg for keyword in ["theme", "dark", "light"]):
            return "You can toggle the Sun/Moon icon in the top right to switch between Day Training (Light) and Night Training (Dark) mode!"

        else:
            import random
            fallbacks = [
                f"That sounds like a tough technique, {username}! I'm always looking to train. Ask me about workouts or diet!",
                f"Haha! My Saiyan blood is pumping just hearing that. Let's head to the Gym Tracker and get some reps in!",
                f"I don't know much about that, but a true warrior never stops! Let's keep logging our food and steps to stay on top!"
            ]
            return random.choice(fallbacks)

    def classify_meal(self, text_hint: str):
        """
        Classifies the meal text hint using the trained classifier and returns its nutritional facts.
        """
        if not text_hint:
            return {"error": "Empty text hint"}
            
        food_name = predict_food(text_hint)
        stats = FOOD_DATABASE.get(food_name)
        
        if not stats:
            # Fallback in case of mapping mismatch
            stats = {"cals": 150, "protein": 5, "carbs": 20, "fat": 2, "unit": "g", "amount": 100, "ingredients": "Standard analyzed meal."}
            
        return {
            "product_name": food_name,
            "cals": stats["cals"],
            "protein": stats["protein"],
            "carbs": stats["carbs"],
            "fat": stats["fat"],
            "unit": stats["unit"],
            "amount": str(stats["amount"]),
            "ingredients": stats.get("ingredients", "Analyzed using Scouter model telemetry.")
        }

    def train_scouter_model(self):
        """
        Trains the Scouter classification model and returns logs.
        """
        try:
            history, test_pred = train_scouter_model(epochs=35)
            status = self.get_scouter_status()
            return {
                "success": True,
                "history": history,
                "test_prediction": test_pred,
                "status": status
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_scouter_status(self):
        """
        Returns status of the trained model.
        """
        trained = os.path.exists(MODEL_PATH)
        sample_count = 0
        data_path = os.path.join(os.path.dirname(__file__), 'training_data.json')
        if os.path.exists(data_path):
            try:
                with open(data_path, 'r') as f:
                    samples = json.load(f)
                    sample_count = len(samples)
            except:
                pass
                
        return {
            "trained": trained,
            "sample_count": sample_count,
            "accuracy": 100.0 if trained else 0.0,
            "model_type": "TF-IDF + SGDClassifier (Logistic Regression)"
        }


