##!/usr/bin/python3

"""
This module is the main module of the backend.
It is also responsible for the communication with the database.
It stores patient data in the database.
"""
from models.base_model import BaseModel, Base
import uuid
import models
from sqlalchemy import Column, String, Integer
from os import getenv
# from models.specific_patient_data import PatientData


class Patient(BaseModel, Base):
    """ Patient class that stores patient data in the database"""
    # if storage_type == 'db':
    __tablename__ = 'main_patient_data'
    first_name = Column(String(128), nullable=True)
    last_name = Column(String(128), nullable=True)
    email = Column(String(128), nullable=True)
    phone_number = Column(Integer, nullable=True)
    Age = Column(Integer, nullable=True)
    address = Column(String(128), nullable=True)
    gender = Column(String(128), nullable=True)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    alcohol = Column(Integer, nullable=True)
    smoking = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    systolic_bp = Column(Integer, nullable=True)
    BMI = Column(Integer, nullable=True)
    BMI_category = Column(String(128), nullable=True)
    glucose_level = Column(Integer, nullable=True)
    cholesterol_level = Column(Integer, nullable=True)
    activity_level = Column(Integer, nullable=True)
    cardio = Column(Integer, nullable=True)

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """
        Convert the Patient object to a dictionary.
        """
        return {
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
            # 'blood_pressure': self.blood_pressure,
            'diastolic_bp': self.diastolic_bp,
            'systolic_bp': self.systolic_bp,
            'BMI': self.BMI,
            'BMI_category': self.BMI_category,
            'activity_level': self.activity_level,
            'glucose_level': self.glucose_level,
            'cholesterol_level': self.cholesterol_level,
            'cardio': self.cardio
        }
