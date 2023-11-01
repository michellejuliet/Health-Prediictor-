##!/usr/bin/python3

"""
This module is the main module of the backend.
It is also responsible for the communication with the database.
It stores patient data in the database.
"""
from models.base_model import BaseModel, Base
import uuid
import models
from sqlalchemy import Column, String
from os import getenv
# from models.specific_patient_data import PatientData

storage_type = getenv("HBNB_TYPE_STORAGE")


class Patient(BaseModel, Base):
    """ Patient class that stores patient data in the database"""
    if storage_type == 'db':
        __tablename__ = 'main_patient_data'
        first_name = Column(String(128), nullable=True)
        last_name = Column(String(128), nullable=True)
        email = Column(String(128), nullable=True)
        phone_number = Column(String(128), nullable=True)
        Age = Column(String(128), nullable=True)
        address = Column(String(128), nullable=True)
        gender = Column(String(128), nullable=True)
        height = Column(String(128), nullable=True)
        weight = Column(String(128), nullable=True)
        alcohol = Column(String(128), nullable=True)
        smoking = Column(String(128), nullable=True)
        blood_pressure = Column(String(128), nullable=True)
        BMI = Column(String(128), nullable=True)
        BMI_category = Column(String(128), nullable=True)
        activity_level = Column(String(128), nullable=True)
        glucose_level = Column(String(128), nullable=True)
        cholesterol_level = Column(String(128), nullable=True)

        # patient_data = relationship(
        #     "PatientData",
        #     uselist=False,  # Configure this as a one-to-one relationship
        #     back_populates="patient",
        #     # single_parent=True  # Add the single_parent=True flag
        #     overlaps="patients"
        # )
        # cities = relationship("City",
        #   backref="state",
        #   cascade="all, delete, delete-orphan")

    else:
        patient_id = str(uuid.uuid4())
        first_name = ""
        last_name = ""
        email = ""
        phone_number = ""
        Age = ""
        address = ""
        gender = ""
        height = ""
        weight = ""
        alcohol = ""
        smoking = ""
        blood_pressure = ""
        BMI = ""
        BMI_category = ""
        activity_level = ""
        glucose_level = ""
        cholesterol_level = ""

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """
        Convert the Patient object to a dictionary.
        """
        patient_dict = {
            'id': self.id,  # Replace with your actual ID field name
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'Age': self.Age,
            'address': self.address,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'alcohol': self.alcohol,
            'smoking': self.smoking,
            'blood_pressure': self.blood_pressure,
            'BMI': self.BMI,
            'BMI_category': self.BMI_category,
            'activity_level': self.activity_level,
            'glucose_level': self.glucose_level,
            'cholesterol_level': self.cholesterol_level
        }

        # Filter out keys with None or missing values
        return {key: value for key, value in patient_dict.items() if value is not None}

    # if models.storage_t != "db":
    #     @property
    #     def patients(self):
    #         """getter for list of city instances related to the state"""
    #         patient_data_list = []
    #         all_data = models.storage.all(PatientData)
    #         for patient in all_data.values():
    #             if patient.data_id == self.id:
    #                 patient_data_list.append(patient)
    #         return patient_data_list
