from catboost import CatBoostClassifier
from imblearn.combine import SMOTETomek
import pandas as pd

# Load dataset
df = pd.read_excel("Preprocessed_Dataset.xlsx")

# Define features and target
feature_columns = [ "age", "bmi", "pre_icu_los_days", "d1_diasbp_max", "d1_diasbp_min",
    "d1_heartrate_max", "d1_heartrate_min", "d1_mbp_max", "d1_mbp_min",
    "d1_resprate_max", "d1_resprate_min", "d1_spo2_min", "d1_sysbp_max",
    "d1_sysbp_min", "d1_temp_max", "d1_temp_min", "h1_diasbp_max",
    "h1_diasbp_min", "h1_heartrate_max", "h1_heartrate_min", "h1_mbp_max",
    "h1_mbp_min", "h1_resprate_max", "h1_resprate_min", "h1_spo2_max",
    "h1_spo2_min", "h1_sysbp_max", "h1_sysbp_min", "d1_glucose_max",
    "d1_glucose_min", "d1_potassium_max", "d1_potassium_min"]

X = df[feature_columns]
y = df["hospital_death"]

# Apply SMOTETomek for balancing
smote_tomek = SMOTETomek(random_state=11)
X_resampled, y_resampled = smote_tomek.fit_resample(X, y)

# Train CatBoost model
model = CatBoostClassifier(iterations=400, learning_rate=0.08, random_seed=11, loss_function='Logloss', eval_metric='PRAUC')
model.fit(X_resampled, y_resampled)

# Save the model
model.save_model("catboost_model.cbm")
print("Model saved as catboost_model.cbm")
