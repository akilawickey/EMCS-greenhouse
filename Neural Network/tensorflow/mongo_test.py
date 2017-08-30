from pymongo import MongoClient
# pprint library is used to make the output look more pretty
from pprint import pprint
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient('127.0.0.1', 27017)
db=client.greenhouse
# Issue the serverStatus command and print the results
# serverStatusResult=db.command("serverStatus")
# pprint(serverStatusResult)
# hum_datas = db.hum_datas

# # fivestar = db.hum_datas.find_one({'val': 5})

# # print(fivestar)

# many_docs = hum_datas.find() # empty query means "retrieve all"
# for doc in many_docs:
#     print(doc)

coll = cl["greenhouse"]["nn_predict"]

data = [{"_id" : 1, "foo" : "HELLO"}, {"_id" : 2, "Blah" : "Bloh"}]
for d in data:
    coll.update({'_id':d['_id']}, d, True)
