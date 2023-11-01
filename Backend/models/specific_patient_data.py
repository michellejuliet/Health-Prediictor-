# #!/usr/bin/python3

# """
# This module is the main module of the backend.
# It is also responsible for the communication with the database.
# It stores patient data in the database.
# """
# from models.base_model import BaseModel, Base
# from sqlalchemy import Column, String, ForeignKey
# from sqlalchemy.orm import relationship
# from os import getenv
# import models

# storage_type = getenv("HBNB_TYPE_STORAGE")


# class PatientData(BaseModel, Base):
#     if storage_type == 'db':
#         __tablename__ = 'specific_patient_data'
#         data_id = Column(String(128), ForeignKey(
#             'main_patient_data.id'), nullable=False)
        
#         patient = relationship(
#             "Patient", backref="patients")
#     else:
#         data_id = ""
#         height = ""
#         weight = ""
#         alcohol = ""
#         smoking = ""
#         blood_pressure = ""
#         BMI = ""
#         BMI_category = ""
#         activity_level = ""
#         glucose_level = ""
#         cholesterol_level = ""

#     def __init__(self, *args, **kwargs):
#         """initializes user"""
#         super().__init__(*args, **kwargs)
