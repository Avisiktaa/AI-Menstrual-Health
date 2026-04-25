import pandas as pd

df = pd.read_csv("period - Copy.csv")

print("Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())

df["BMI"].fillna(df["BMI"].mean(), inplace=True)
df["Length_of_cycle"].fillna(df["Length_of_cycle"].mean(), inplace=True)
df["Mean_of_length_of_cycle"].fillna(df["Mean_of_length_of_cycle"].mean(), inplace=True)

# Fill categorical/score with median
df["Menses_score"].fillna(df["Menses_score"].median(), inplace=True)

# Age (safe default)
df["Age"].fillna(25, inplace=True)

df["cycle_variation"] = abs(df["Length_of_cycle"] - df["Mean_of_length_of_cycle"])

df["long_cycle"] = df["Length_of_cycle"].apply(lambda x: 1 if x > 35 else 0)

def bmi_category(bmi):
    if bmi < 18.5:
        return 0
    elif bmi < 25:
        return 1
    elif bmi < 30:
        return 2
    else:
        return 3

df["bmi_category"] = df["BMI"].apply(bmi_category)

df["irregular_score"] = df["cycle_variation"] + df["Menses_score"]

def label_pcod(row):
    score = 0

    if row["Length_of_cycle"] > 35:
        score += 2
    if row["cycle_variation"] > 5:
        score += 2
    if row["BMI"] > 25:
        score += 1
    if row["Menses_score"] > 4:
        score += 1

    if score >= 4:
        return 2   # High
    elif score >= 2:
        return 1   # Medium
    else:
        return 0   # Low

df["pcod_label"] = df.apply(label_pcod, axis=1)

df.drop([
    "Income",
    "Estimated_day_of_ovulution"
], axis=1, inplace=True)

print(df.head())
print(df.describe())



print(df.dtypes)

df.replace({"yes": 1, "no": 0}, inplace=True)

numeric_df = df.select_dtypes(include=["int64", "float64"])
corr_matrix = numeric_df.corr()
print("\n=== CORRELATION WITH PCOD_LABEL ===")
print(corr_matrix["pcod_label"].sort_values(ascending=False))

features = [
    "long_cycle",
    "irregular_score",
    "cycle_variation",
    "Length_of_cycle"
]

print("\n=== TOP FEATURES ===")
for feature in features:
    print(f"{feature}: {corr_matrix.loc[feature, 'pcod_label']:.4f}")
    
df.to_csv("processed.csv", index=False)
print("Processed data saved!")