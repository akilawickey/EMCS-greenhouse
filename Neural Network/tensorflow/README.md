## Setting Up the Environment

Ubuntu

The overall Linux setup commands for TensorFlow are on tensorflow.org.

In summary, you will need to:

Install Docker on your machine.
Create a Docker group to allow launching containers without sudo.
Launch a Docker container with the TensorFlow image.

```
docker run -it -p 8888:8888 tensorflow/tensorflow:0.10.0rc0 bash
```
Check to see if your TensorFlow works by invoking Python from the container’s command line (you’ll see root@xxxxxxx#):

## python

```
import tensorflow as tf
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print(sess.run(hello))
If you see "Hello, Tensorflow", everything is in order. You should exit your docker instance (type exit), and go to the section *Downloading This Repository.
```
