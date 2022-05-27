import os
os.system('clear');


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
plt.style.use('seaborn-whitegrid')


data = pd.read_csv('simulation/test.csv', parse_dates=['date']);


data.set_index('date', inplace=True);



from statsmodels.tsa.seasonal import seasonal_decompose 
decomp = seasonal_decompose(data, model='additive')


from statsmodels.tsa.holtwinters import ExponentialSmoothing
train_data = data[:20];
test_data = data[:40];


model = ExponentialSmoothing(train_data.value, trend='add', seasonal='add', seasonal_periods=7).fit()
test_prediction = model.forecast(20)
plt.plot(test_prediction, color='red');
plt.plot(test_data, color='blue');
plt.show()
