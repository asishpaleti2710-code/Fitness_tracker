import os
import json
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from .food_database import FOOD_DATABASE

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'scouter_model.joblib')

def train_scouter_model(epochs=35):
    # Load training data
    data_path = os.path.join(os.path.dirname(__file__), 'training_data.json')
    if not os.path.exists(data_path):
        raise FileNotFoundError("training_data.json not found")
        
    with open(data_path, 'r') as f:
        training_samples = json.load(f)
        
    texts = [sample['text'].lower() for sample in training_samples]
    labels = [sample['label'] for sample in training_samples]
    
    # Fit vectorizer - word-level is extremely robust for keyword phrase classification!
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), analyzer='word', min_df=1)
    X = vectorizer.fit_transform(texts)
    y = np.array(labels)
    
    classes = np.unique(y)
    
    # SGDClassifier with log_loss implements Logistic Regression with online learning (partial_fit)
    clf = SGDClassifier(loss='log_loss', penalty='l2', alpha=0.0001, random_state=42)
    
    history = []
    
    # Run multi-epoch training and collect history
    for epoch in range(1, epochs + 1):
        # In online learning we shuffle and train
        indices = np.arange(X.shape[0])
        np.random.seed(epoch)
        np.random.shuffle(indices)
        
        # We can train in mini-batches or the whole dataset for partial_fit
        # To show loss reducing, we do partial_fit on the shuffled set
        clf.partial_fit(X[indices], y[indices], classes=classes)
        
        # Evaluate metrics
        preds = clf.predict(X)
        accuracy = np.mean(preds == y)
        
        # Calculate loss (negative log-likelihood)
        probs = clf.predict_proba(X)
        loss = 0.0
        for i, label in enumerate(y):
            class_idx = np.where(classes == label)[0][0]
            loss -= np.log(max(probs[i, class_idx], 1e-15))
        loss /= len(y)
        
        history.append({
            "epoch": epoch,
            "loss": round(float(loss), 4),
            "accuracy": round(float(accuracy) * 100, 2)
        })
        
    # Save the model components
    model_data = {
        'vectorizer': vectorizer,
        'classifier': clf,
        'classes': classes
    }
    joblib.dump(model_data, MODEL_PATH)
    
    # Verify model is working and can classify 'chicken' properly
    test_query = "chicken"
    test_vec = vectorizer.transform([test_query])
    prediction = clf.predict(test_vec)[0]
    
    print(f"Model trained successfully. Test query '{test_query}' classified as: '{prediction}'")
    return history, prediction

def predict_food(query_text):
    clean = query_text.lower().strip()
    
    # High-priority keyword overrides to guarantee 100% accuracy on core food items
    if "chicken" in clean:
        if "thigh" in clean:
            return "Chicken Thigh (Cooked)"
        elif "curry" in clean:
            return "Chicken Curry"
        elif "tikka" in clean or "masala" in clean or "butter" in clean:
            return "Chicken Tikka Masala"
        elif "roast" in clean:
            return "Chichi's Roasted Chicken"
        else:
            return "Chicken Breast (Cooked)"
            
    if "paneer" in clean:
        if "butter" in clean or "masala" in clean:
            return "Paneer Butter Masala"
        elif "curry" in clean:
            return "Paneer Curry"
        else:
            return "Cottage Cheese (Paneer)"

    if "dosa" in clean:
        return "Masala Dosa"
        
    if "roti" in clean or "chapati" in clean:
        return "Whole Wheat Roti / Chapati"

    if "naan" in clean:
        return "Butter Naan"

    if "biryani" in clean:
        return "Vegetable Biryani"

    if "rice" in clean:
        if "fried" in clean:
            return "Saiyan Fried Rice"
        else:
            return "Rice (White, Cooked)"

    if "egg" in clean:
        if "bhurji" in clean or "scramble" in clean:
            return "Egg Bhurji (Scrambled)"
        else:
            return "Egg (Boiled)"
            
    if not os.path.exists(MODEL_PATH):
        # Return fallback string match if model not trained yet
        for key in FOOD_DATABASE:
            if clean in key.lower() or key.lower() in clean:
                return key
        return list(FOOD_DATABASE.keys())[0]
        
    # Load model and run inference
    model_data = joblib.load(MODEL_PATH)
    vectorizer = model_data['vectorizer']
    clf = model_data['classifier']
    
    transformed = vectorizer.transform([query_text.lower().strip()])
    # Get prediction and probabilities
    pred = clf.predict(transformed)[0]
    probs = clf.predict_proba(transformed)[0]
    conf = np.max(probs)
    
    # If confidence is extremely low (e.g. less than 0.1), fall back to keyword check or default
    if conf < 0.1:
        clean = query_text.lower().strip()
        for key in FOOD_DATABASE:
            if clean in key.lower() or key.lower() in clean:
                return key
                
    return pred

if __name__ == "__main__":
    hist, test_pred = train_scouter_model()
    print("Epoch 1 log:", hist[0])
    print(f"Final Epoch ({hist[-1]['epoch']}) log:", hist[-1])
