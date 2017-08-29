from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import numpy as np
import pandas as pd

# df = pd.read_csv('greenhouse_training.csv' , names = ['id','date','time','temp','soil','hum','light','fan','pump']) #load csv data 

# # print df
# temp = df.temp
# soil = df.soil
# hum = df.hum
# light = df.light
# fan = df.fan
# pump = df.pump

# temp.fillna(temp.mean(), inplace=True)
# soil.fillna(soil.mean(), inplace=True)
# hum.fillna(hum.mean(), inplace=True)
# light.fillna(light.mean(), inplace=True)
# fan.fillna(fan.mean(), inplace=True)
# pump.fillna(pump.mean(), inplace=True)

# # data = np.column_stack(temp,soil)
# # print temp

# grouped = pd.concat([temp, soil, hum, light])
# print soil
# Data sets
# Data sets
# IRIS_TRAINING = "iris_training.csv"
# IRIS_TEST = "iris_test.csv"

IRIS_TRAINING = "greenhouse_training.csv"
IRIS_TEST = "greenhouse_testing.csv"
# Load datasets.
training_set = tf.contrib.learn.datasets.base.load_csv_with_header(
    filename=IRIS_TRAINING,
    target_dtype=np.int,
    features_dtype=np.float32)
test_set = tf.contrib.learn.datasets.base.load_csv_with_header(
    filename=IRIS_TEST,
    target_dtype=np.int,
    features_dtype=np.float32)

# Specify that all features have real-value data
feature_columns = [tf.contrib.layers.real_valued_column("", dimension=4)]

# Build 3 layer DNN with 10, 20, 10 units respectively.
classifier = tf.contrib.learn.DNNClassifier(feature_columns=feature_columns,
                                            hidden_units=[10, 20, 10],
                                            n_classes=3,
                                            model_dir="/tmp/iris_model")

# Fit model.
classifier.fit(x=training_set.data,
               y=training_set.target,
               steps=2000)

# Evaluate accuracy.
accuracy_score = classifier.evaluate(x=test_set.data,
                                     y=test_set.target)["accuracy"]
print('Accuracy: {0:f}'.format(accuracy_score))

# Classify two new flower samples.
new_samples = np.array(
    [[26.6,998,86.5,16], [25,941,99,45]], dtype=float)
y = list(classifier.predict(new_samples, as_iterable=True))
print('Predictions: {}'.format(str(y)))

# 26.6,998,86.5,16,1
# 25.6,1008,90.6,11,0