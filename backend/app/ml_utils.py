import numpy as np

class DummyModel:
    def predict(self, X):
        return np.random.randint(0, 100, size=len(X))

class DummyScaler:
    def fit_transform(self, X):
        return X
    def transform(self, X):
        return X
