# Health-Prediictor-
This is repository where data collected for a health analysis on Cardiovascular disease and also Low Birth Weight

# Introduction
Cardiovascular diseases (CVDs) or heart disease are the number one cause of death globally with 17.9 million death cases each year. 
CVDs are concertedly contributed by hypertension, diabetes, overweight and unhealthy lifestyles. You can read more on the heart disease statistics and causes for self-understanding. 
This project covers manual exploratory data analysis and using pandas profiling in Jupyter Notebook, on Google Colab. The dataset used in this project is UCI Heart Disease dataset, 
and both data and code for this project are available on our GitHub repository.

# Data Set Explanations
Initially, the dataset contains 13 features or attributes from 70k patients;

# The outline for EDA are as follows;
1. Import and get to know the data

2. Data Cleaning
a) Check the data type
b) Check for the data characters mistakes
c) Check for missing values and replace them
d) Check for duplicate rows
e) Statistics summary
f) Outliers and how to remove them

3. Distributions and Relationship
a) Categorical variable distribution
b) Continuous variable distribution
c) Relationship between categorical and continuous variables

# Variables or features explanations:

age (Age in days)
sex : (1 = female 2 = male)
cp (Chest Pain Type): [ 0: asymptomatic, 1: atypical angina, 2: non-anginal pain, 3: typical angina]
trestbps (Resting Blood Pressure in mm/hg )
chol (Serum Cholesterol in mg/dl)
fps (Fasting Blood Sugar > 120 mg/dl): [0 = no, 1 = yes]
restecg (Resting ECG): [0: showing probable or definite left ventricular hypertrophy by Estes’ criteria, 1: normal, 2: having ST-T wave abnormality]
thalach (maximum heart rate achieved)
exang (Exercise Induced Angina): [1 = yes, 0 = no]
oldpeak (ST depression induced by exercise relative to rest)
slope (the slope of the peak exercise ST segment): [0: downsloping; 1: flat; 2: upsloping]
ca [number of major vessels (0–3)
thal : [1 = normal, 2 = fixed defect, 3 = reversible defect]
target: [0 = disease, 1 = no disease]
