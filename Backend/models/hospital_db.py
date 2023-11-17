from sqlalchemy import Column, Integer, String, DATETIME
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models.base_model import BaseModel, Base

# Base = declarative_base()


class Hospital(BaseModel, Base):
    __tablename__ = 'hospitals'
    id = Column(String(60), primary_key=True)
    created_at = Column(DATETIME, default=datetime.utcnow)
    updated_at = Column(DATETIME, default=datetime.utcnow)
    name = Column(String(120), nullable=False)
    location = Column(String(120), nullable=True)
    patients = relationship("Patient", back_populates="hospital")

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """
        Convert the Hospital object to a dictionary.
        """
        return {
            'id': self.id,  # Replace with your actual ID field name
            'name': self.name,
            'location': self.location,
            'created_at': self.created_at,
            'updated_at': self.updated_at
            }