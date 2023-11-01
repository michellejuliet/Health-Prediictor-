#!/usr/bin/python3
""" serialization and deserialization"""

import json
import pandas as pd
import csv
from models.base_model import BaseModel
from models.main_patient_data import Patient
import models
# from models.specific_patient_data import PatientData

classes = {"BaseModel": BaseModel, "Patient": Patient}


class FileStorage:
    """
    class that serializes instances to a JSON file 
    and deserializes JSON file to  instances
    """
    __file_path = 'file.json'
    __csv_path = 'file.csv'
    __objects = {}

    def all(self, cls=None):
        """returns the dictionary __objects"""
        if cls is not None:
            new_dict = {}
            for key, value in self.__objects.items():
                if cls == value.__class__ or cls == value.__class__.__name__:
                    new_dict[key] = value
            return new_dict
        return self.__objects

    def new(self, obj):
        """sets in __objects the obj with key <obj class name>.id"""
        if obj is not None:
            key = obj.__class__.__name__ + "." + obj.id
            self.__objects[key] = obj

    def save(self):
        """serializes __objects to the JSON file (path: __file_path)"""
        json_objects = {}
        for key in self.__objects:
            if key == "password":
                json_objects[key].decode()
            json_objects[key] = self.__objects[key].to_dict()
        with open(self.__file_path, 'w') as f:
            json.dump(json_objects, f)

    def reload(self):
        """deserializes the JSON file to __objects"""
        try:
            with open(self.__file_path, 'r') as f:
                jo = json.load(f)
            for key in jo:
                self.__objects[key] = classes[jo[key]["__class__"]](**jo[key])
        except:
            pass

    def delete(self, obj=None):
        """delete obj from __objects if it’s inside"""
        if obj is not None:
            key = obj.__class__.__name__ + '.' + obj.id
            if key in self.__objects:
                del self.__objects[key]

    def close(self):
        """call reload() method for deserializing the JSON file to objects"""
        self.reload()

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls not in classes.values():
            return None

        all_cls = models.storage.all(cls)
        for value in all_cls.values():
            if (value.id == id):
                return value

        return None

    def count(self, cls=None):
        """
        count the number of objects in storage
        """
        all_class = classes.values()

        if not cls:
            count = 0
            for clas in all_class:
                count += len(models.storage.all(clas).values())
        else:
            count = len(models.storage.all(cls).values())

        return count

    #  store the values in a CSV file
    def save_to_file(self):
        with open(FileStorage.__csv_path, 'w') as csv_file:
            writer = csv.writer(csv_file)
            for key, value in self.__objects.items():
                writer.writerow([key, value])

    def save_to_excel(self):
        data = []
        # Define the starting key from which you want to include key-value pairs
        starting_key = 'first_name'

        # Iterate through all objects and their keys and values
        for key, value in self.__objects.items():
            obj_data = []
            key_order = [key for key in value.__dict__.keys()][3:]
            print(key_order)
            for key in key_order:
                obj_data.append(value.__dict__[key])

        data.append(obj_data)
        df = pd.DataFrame(data, columns=key_order)
        df.to_excel("data.xlsx", index=False)  # Save to an Excel file
