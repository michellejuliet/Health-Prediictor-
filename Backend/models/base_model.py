#!/usr/bin/python3

"""
This module is the main module of the backend.
It is responsible for the communication with the frontend.
It is also responsible for the communication with the database.
It contains, among other things, the following functions:
-uuid, created_at, updated_at, deleted_at
"""
import uuid
from datetime import datetime
import models
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DATETIME
from os import getenv

storage_type = getenv("HBNB_TYPE_STORAGE")

if storage_type == 'db':
    Base = declarative_base()
else:
    Base = object

time = "%Y-%m-%dT%H:%M:%S.%f"

class BaseModel:

    if models.storage_t == "db":
        id = Column(String(60), primary_key=True)
        created_at = Column(DATETIME, default=datetime.utcnow)
        updated_at = Column(DATETIME, default=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """Initialization of the base model"""
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    setattr(self, key, value)
            if kwargs.get("created_at", None) and type(self.created_at) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated_at", None) and type(self.updated_at) is str:
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                self.updated_at = datetime.utcnow()
            if kwargs.get("id", None) is None:
                self.id = str(uuid.uuid4())
        else:
            self.id = str(uuid.uuid4())
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def __str__(self):
        """String representation of the BaseModel class"""
        return "[{:s}] ({:s}) {}".format(self.__class__.__name__, self.id,
                                         self.__dict__)

    def save(self):
        """updates the attribute 'updated_at' with the current datetime"""
        self.updated_at = datetime.utcnow()
        models.storage.new(self)
        models.storage.save()
        # models.storage.save_to_file()
        # models.storage.save_to_excel()

    def to_dict(self):
        """Return a dictionary containing all keys/values of __dict__"""
        new_dict = self.__dict__.copy()
        new_dict['__class__'] = self.__class__.__name__
        new_dict['created_at'] = self.created_at.isoformat()
        new_dict['updated_at'] = self.updated_at.isoformat()
        return new_dict

    def delete(self):
        """Delete the current instance from the storage"""
        models.storage.delete(self)

    def reload(self):
        """Reload the current instance from the storage"""
        models.storage.reload()
