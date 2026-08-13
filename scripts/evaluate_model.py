import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

def train_and_evaluate():
    print("Loading California Housing dataset...")
    data = fetch_california_housing()
    X = data.data
    y = data.target

    print("Splitting dataset into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    print("Generating predictions...")
    predictions = model.predict(X_test)

    print("\n--- Model Evaluation ---")
    print("R²:", r2_score(y_test, predictions))
    print("MAE:", mean_absolute_error(y_test, predictions))

if __name__ == "__main__":
    train_and_evaluate()
