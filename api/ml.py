import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from datetime import date, datetime

# load data from disk
data = pd.read_csv('data.csv', parse_dates=['date']);



# truncate to avoid overflow
data = data.tail(210);

# calculate the number of predictions
today = date.today();
timestamp = np.array(data.tail(1))[0][0];
# last_date_on_dataset = date(timestamp.year, timestamp.month, timestamp.day);
last_date_on_dataset = date.fromtimestamp(timestamp)
delta = today - last_date_on_dataset;
number_of_predictions = delta.days;

data.set_index('date', inplace=True);

model = ExponentialSmoothing(data.usage, trend='add', seasonal='add', seasonal_periods=7).fit()
forecast = model.forecast(number_of_predictions)
today_forecast = np.array(forecast.tail(1))[0];
print(today_forecast);