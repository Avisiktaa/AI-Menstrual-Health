import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE

# ==============================
# 1. LOAD DATA
# ==============================
df = pd.read_csv("processed.csv")

print("Data loaded:", df.shape)

# ==============================
# 2. FEATURES
# ==============================
features = [
    "long_cycle",
    "irregular_score",
    "cycle_variation",
    "Length_of_cycle"
]

X = df[features]
y = df["pcod_label"]

# ==============================
# 3. TRAIN-TEST SPLIT
# ==============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ==============================
# 3.5. HANDLE CLASS IMBALANCE
# ==============================
smote = SMOTE(random_state=42, k_neighbors=2)
X_train, y_train = smote.fit_resample(X_train, y_train)

# ==============================
# 4. MODELS (REGULARIZED)
# ==============================

models = {
    "RandomForest": RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42
    ),
    
    "LogisticRegression": LogisticRegression(max_iter=1000, class_weight="balanced")
}

best_model = None
best_score = 0

print("\n=== CROSS-VALIDATION PERFORMANCE ===")

for name, model in models.items():
    
    # Cross-validation with stratification
    skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    scores = cross_val_score(model, X_train, y_train, cv=skf)
    avg_score = scores.mean()

    print(f"{name}: {avg_score:.4f}")

    if avg_score > best_score:
        best_score = avg_score
        best_model = model

# ==============================
# 5. TRAIN BEST MODEL
# ==============================
best_model.fit(X_train, y_train)

# Test accuracy (realistic)
test_score = best_model.score(X_test, y_test)

# ==============================
# 6. SAVE MODEL
# ==============================
joblib.dump(best_model, "model.pkl")

print("\nBest model saved!")

print("Cross-val accuracy:", best_score)
print("Test accuracy:", test_score)