from sqlalchemy import Column, Integer, String, ForeignKey, VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from models.base_model import BaseModel, Base


class PatientHealthInfo(BaseModel, Base):
    __tablename__ = 'patient_health_info'
    id = Column(String(60), primary_key=True)
    patient_id = Column(String(60), ForeignKey('patients.id'))
    height = Column(Integer)
    weight = Column(VARCHAR, nullable=True)
    gender = Column(String(128), nullable=True)
    alcohol = Column(VARCHAR, nullable=True)
    smoking = Column(VARCHAR, nullable=True)
    diastolic_bp = Column(VARCHAR, nullable=True)
    systolic_bp = Column(VARCHAR, nullable=True)
    BMI = Column(VARCHAR, nullable=True)
    BMI_category = Column(String(128), nullable=True)
    glucose_level = Column(VARCHAR, nullable=True)
    cholesterol_level = Column(VARCHAR, nullable=True)
    activity_level = Column(VARCHAR, nullable=True)
    cardio = Column(VARCHAR, nullable=True)
    patient = relationship("Patient", back_populates="health_info")

    def to_dict(self):
        """
        Convert the Patient object to a dictionary.
        """
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'height': self.height,
            'weight': self.weight,
            'alcohol': self.alcohol,
            'smoking': self.smoking,
            'diastolic_bp': self.diastolic_bp,
            'systolic_bp': self.systolic_bp,
            'BMI': self.BMI,
            'BMI_category': self.BMI_category,
            'activity_level': self.activity_level,
            'glucose_level': self.glucose_level,
            'cholesterol_level': self.cholesterol_level,
            'cardio': self.cardio,
            'gender': self.gender

        }
