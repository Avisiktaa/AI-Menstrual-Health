import sys
import joblib
import pandas as pd
import json
import warnings
import os

# Suppress sklearn warnings
warnings.filterwarnings('ignore')

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "model.pkl")

# Load model
model = joblib.load(model_path)

# Input
try:
    long_cycle = int(sys.argv[1])
    irregular_score = float(sys.argv[2])
    cycle_variation = float(sys.argv[3])
    length_of_cycle = float(sys.argv[4])
except:
    print(json.dumps({"error": "Invalid input"}))
    sys.exit(1)

# Features
features = pd.DataFrame([[
    long_cycle,
    irregular_score,
    cycle_variation,
    length_of_cycle
]], columns=[
    "long_cycle",
    "irregular_score",
    "cycle_variation",
    "Length_of_cycle"
])

# Prediction
prediction = model.predict(features)[0]

try:
    proba = model.predict_proba(features)[0]
    confidence = float(proba[prediction]) * 100
except:
    confidence = None

# Mapping
risk_map = {
    0: "Low",
    1: "Medium",
    2: "High"
}

output = {
    "risk": risk_map.get(int(prediction), "Unknown"),
    "confidence": round(confidence, 2) if confidence else None
}

print(json.dumps(output))