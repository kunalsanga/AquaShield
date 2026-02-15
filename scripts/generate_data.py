import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set seed for reproducibility
np.random.seed(42)

# Generate synthetic data for water pollution and disease prediction
# Features based on typical water quality parameters and environmental factors
# Target: Disease cases (Cholera, Typhoid, Diarrhea)

def generate_synthetic_data(n_samples=1000):
    data = []
    
    districts = ['Dhemaji', 'Lakhimpur', 'Sonitpur', 'Barpeta', 'Morigaon', 'Nagaon', 'Golaghat', 'Jorhat', 'Sivasagar', 'Dibrugarh']
    villages_per_district = ['Village_A', 'Village_B', 'Village_C', 'Village_D', 'Village_E']
    
    start_date = datetime(2023, 1, 1)
    
    for i in range(n_samples):
        date = start_date + timedelta(days=np.random.randint(0, 365*2))
        district = np.random.choice(districts)
        village = f"{district}_{np.random.choice(villages_per_district)}"
        
        # Environmental features (Seasonality affects these)
        month = date.month
        is_monsoon = 1 if 5 <= month <= 9 else 0
        
        # Water Quality Parameters
        # pH: Normal 6.5-8.5. Lower/Higher indicates pollution.
        ph = np.random.normal(7.0, 0.5)
        if is_monsoon:
            ph -= 0.3 # Acid rain potential
            
        # Turbidity (NTU): Higher in monsoon. Normal < 5 NTU.
        turbidity = np.random.lognormal(1.0, 0.5) 
        if is_monsoon:
            turbidity += np.random.uniform(5, 20)
            
        # Dissolved Oxygen (mg/L): Healthy > 6.
        do = np.random.normal(7.5, 1.0)
        
        # Temperature (C)
        temp = np.random.normal(25, 5)
        if 4 <= month <= 9:
            temp += 5
            
        # Biological Oxygen Demand (BOD)
        bod = np.random.exponential(2.0)
        
        # Coliform Bacteria (MPN/100ml) - Key indicator for disease
        # Higher in monsoon due to runoff using open defecation areas etc.
        coliform = np.random.exponential(50)
        if is_monsoon:
            coliform *= 2.5
            
        # Rainfall (mm) - simulated based on season
        rainfall = 0
        if is_monsoon:
            rainfall = np.random.exponential(15)
        else:
            rainfall = np.random.exponential(2)
            
        # Feature Engineering: Contamination Score (synthetic latent variable)
        contamination_score = (
            (turbidity / 10) + 
            (coliform / 50) + 
            (abs(ph - 7) * 2) + 
            (temp / 30) +
            (rainfall / 20)
        )
        
        # Target Variables: Disease Cases per 100,000 people (Poisson distributed based on contamination)
        # Cholera (highly linked to contaminated water)
        cholera_cases = np.random.poisson(contamination_score * 1.5)
        
        # Typhoid
        typhoid_cases = np.random.poisson(contamination_score * 1.2)
        
        # Diarrhea
        diarrhea_cases = np.random.poisson(contamination_score * 3.0)
        
        # Hepatitis
        hepatitis_cases = np.random.poisson(contamination_score * 0.5)

        data.append({
            'Date': date.strftime('%Y-%m-%d'),
            'District': district,
            'Village': village,
            'pH': round(ph, 2),
            'Turbidity': round(turbidity, 2),
            'Dissolved_Oxygen': round(do, 2),
            'Temperature': round(temp, 2),
            'BOD': round(bod, 2),
            'Coliform_Bacteria': round(coliform, 2),
            'Rainfall': round(rainfall, 2),
            'Cholera_Cases': cholera_cases,
            'Typhoid_Cases': typhoid_cases,
            'Diarrhea_Cases': diarrhea_cases,
            'Hepatitis_Cases': hepatitis_cases
        })
        
    df = pd.DataFrame(data)
    df.to_csv('water_pollution_disease.csv', index=False)
    print("Synthetic dataset created: water_pollution_disease.csv")

if __name__ == "__main__":
    generate_synthetic_data()
