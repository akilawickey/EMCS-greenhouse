
# Create first network with Keras
from keras.models import Sequential
from keras.layers import Dense
import tensorflow as tf
import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
import pandas as pd

# fix random seed for reproducibility
seed = 7
np.random.seed(seed)
# load pima indians dataset
dataset = np.genfromtxt("dataset.csv", delimiter=",")
# split into input (X) and output (Y) variables
X = dataset[:,3]
Y = dataset[:,4:6]

print X
print Y
# split into input (X) and output (Y) variables
# X = dataset[:,0:2]
# Y = dataset[:,8]


# create model
# print dataset

model = Sequential()
model.add(Dense(12, input_dim=8, init='uniform', activation='relu'))
model.add(Dense(8, init='uniform', activation='relu'))
model.add(Dense(1, init='uniform', activation='sigmoid'))
# Compile model
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
# Fit the model
model.fit(all_X, all_Y, nb_epoch=150, batch_size=10,  verbose=2)
# calculate predictions
predictions = model.predict(all_X)
# round predictions
rounded = [round(x[0]) for x in predictions]
print(rounded)