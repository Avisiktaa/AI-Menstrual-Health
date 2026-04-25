import sys
import joblib
import pandas as pd

# ==============================
# 1. LOAD TRAINED MODEL
# ==============================
model = joblib.load("model.pkl")

# ==============================
# 2. GET INPUT FROM NODE / CLI
# ==============================
# Expected order:
# long_cycle (0 or 1), irregular_score, cycle_variation, Length_of_cycle

if len(sys.argv) != 5:
    print("Usage: python predict.py <long_cycle> <irregular_score> <cycle_variation> <length_of_cycle>")
    print("Example: python predict.py 1 10 12 45")
    print("  long_cycle: 1 if cycle > 35 days, else 0")
    print("  irregular_score: irregularity score (e.g., 10)")
    print("  cycle_variation: variation in days (e.g., 12)")
    print("  length_of_cycle: actual cycle length in days (e.g., 45)")
    sys.exit(1)

try:
    long_cycle = int(sys.argv[1])
    irregular_score = float(sys.argv[2])
    cycle_variation = float(sys.argv[3])
    length_of_cycle = float(sys.argv[4])
    
    # Validation
    if long_cycle not in [0, 1]:
        print("Error: long_cycle must be 0 or 1")
        sys.exit(1)
    if length_of_cycle < 20 or length_of_cycle > 60:
        print("Warning: length_of_cycle seems unusual (expected 20-60 days)")
except ValueError:
    print("Error: Invalid input format")
    sys.exit(1)

# ==============================
# 3. PREPARE FEATURES
# ==============================
features = pd.DataFrame([[
    long_cycle,
    irregular_score,
    cycle_variation,
    length_of_cycle
]], columns=["long_cycle", "irregular_score", "cycle_variation", "Length_of_cycle"])

# ==============================
# 4. PREDICT
# ==============================
prediction = model.predict(features)[0]
proba = model.predict_proba(features)[0]

print(f"INPUT: {features}")
print(f"RAW PREDICTION: {prediction}")

# Map numeric → label
risk_map = {
    0: "Low",
    1: "Medium",
    2: "High"
}

pcod_risk = risk_map.get(prediction, "Unknown")

# ==============================
# 5. OUTPUT RESULT
# ==============================
confidence = proba[prediction] * 100

print(pcod_risk)
print(f"Confidence: {confidence:.2f}%")
print(f"\nProbabilities:")
print(f"  Low: {proba[0]*100:.2f}%")
print(f"  Medium: {proba[1]*100:.2f}%")
print(f"  High: {proba[2]*100:.2f}%")

#print("INPUT:", features)
#print("RAW PREDICTION:", prediction)