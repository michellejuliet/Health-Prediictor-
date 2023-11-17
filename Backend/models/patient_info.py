from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
# from datetime import datetime
from models.base_model import BaseModel, Base

# Base = declarative_base()


class Patient(BaseModel, Base):
    __tablename__ = 'patients'
    id = Column(String(60), primary_key=True)
    hospital_id = Column(String(60), ForeignKey('hospitals.id'))
    first_name = Column(String(128))
    last_name = Column(String(128), nullable=True)
    email = Column(String(128), nullable=True)
    phone_number = Column(Integer, nullable=True)
    Age = Column(Integer, nullable=True)
    address = Column(String(128), nullable=True)
    hospital = relationship("Hospital", back_populates="patients")
    health_info = relationship(
        "PatientHealthInfo", back_populates="patient", uselist=False)

    def to_dict(self):
        """
        Convert the Patient object to a dictionary.
        """
        return {
            'id': self.id,
            'hospital_id': self.hospital_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'Age': self.Age,
            'address': self.address,
        }
