#!/usr/bin/python3
# test storage
from models.main_patient_data import Patient
from models.specific_patient_data import PatientData
from models import storage
from models.base_model import BaseModel


# print("-- Create a new object --")
# my_model = BaseModel()
# my_model.name = "My_First_Model"
# my_model.my_number = 89
# my_model.save()
# print(my_model)

# all_objs = storage.all()
# print("-- Reloaded objects --")
# for obj_id in all_objs.keys():
#     obj = all_objs[obj_id]
#     print(obj)


# print("-- Create a new Patient --")
# my_user = Patient()
# my_user.first_name = "Betty"
# my_user.last_name = "Bar"
# my_user.email = "airbnb@mail.com"
# # my_user.password = "root"
# my_user.save()
# print(my_user)

# print("-- Create a new Patient 2 --")
my_user2 = Patient()
my_user2.first_name = "John"
my_user2.last_name = "makamu"
my_user2.email = "airbnb2@mail.com"
my_user2.address = "Nairobi"
my_user2.gender = "Male"
my_user2.Age = "55"
height = "1.75"
my_user2.weight = "70"
my_user2.alcohol = "5.5"
my_user2.smoking = "2"
my_user2.blood_pressure = "20"
my_user2.BMI = "4"
my_user2.BMI_category = "done"
my_user2.activity_level = "5"
my_user2.glucose_level = "5"
my_user2.cholesterol_level = "5"
my_user2.save()
print(my_user2)
