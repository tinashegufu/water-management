
import os
os.system('clear');


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
plt.style.use('seaborn-whitegrid')


# functions
def test_stationarity(timeseries, window=12):
    
	#Determing rolling statistics
	rolmean = timeseries.rolling(window=window).mean();
	rolstd = timeseries.rolling(window=window).std();

	#Plot rolling statistics:
	plt.plot(timeseries, color='blue',label='Original')
	plt.plot(rolmean, color='red', label='Rolling Mean')
	plt.plot(rolstd, color='black', label = 'Rolling Std')
	plt.legend(loc='best')
	plt.title('Rolling Mean & Standard Deviation')
	plt.show()

	#Perform Dickey-Fuller test:
	print('Results of Dickey-Fuller Test:')
	dftest = adfuller(timeseries, autolag='AIC')
	dfoutput = pd.Series(dftest[0:4], index=['Test Statistic','p-value','#Lags Used','Number of Observations Used'])
	for key,value in dftest[4].items():
		dfoutput['Critical Value (%s)'%key] = value
	print(dfoutput)



data = pd.read_csv('simulation/test.csv');
data.set_index('time', inplace=True);
data = data[0:147]
test_stationarity(data, window=7);

diff1 = data.diff();
diff2  =  diff1.diff();

plt.plot(diff1, color='red');
plt.plot(diff2, color='blue');
plt.plot(data, color='green');
plt.show();


# data = pd.read_csv('/home/xavier/Downloads/AirPassengers.csv');
# data.set_index('Month', inplace=True);

# test_stationarity(data, window=12);
