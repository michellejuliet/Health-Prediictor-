# #!/usr/bin/python3
# """database storage engine"""
# from os import getenv
# from models.base_model import Base
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, scoped_session
# # from sqlalchemy import text
# from models.main_patient_data import Patient
# import models
# import logging

# classes = {"Patient": Patient}


# class DBStorage:
#     __engine = None
#     __session = None

#     def __init__(self):
#         # HBNB_MYSQL_USER = 'admin_dev'
#         # HBNB_MYSQL_PWD = 'Pwd.admin1dev'
#         # # HBNB_MYSQL_PWD = HBNB_MYSQL_PWD
#         # # HBNB_MYSQL_PWD = getenv('HBNB_MYSQL_PWD')
#         # HBNB_MYSQL_HOST = 'localhost'
#         # HBNB_MYSQL_DB = 'patient_dev_db'
#         # HBNB_ENV = 'test'
#         # self.__engine = create_engine(
#         #     f'mysql+mysqldb://{HBNB_MYSQL_USER}:{HBNB_MYSQL_PWD}@{HBNB_MYSQL_HOST}/{HBNB_MYSQL_DB}')
#         self.__engine = create_engine(
#             'mysql+mysqldb://admin_dev:Pwd.admin1dev@localhost/patient_dev_db',
#             pool_pre_ping=True)

#         # if HBNB_ENV == 'test':
#         # Base.metadata.drop_all(bind=self.__engine)

#     def all(self, cls=None):
#         """query on the current database session"""
#         new_dict = {}
#         for clss in classes:
#             if cls is None or cls is classes[clss] or cls is clss:
#                 objs = self.__session.query(classes[clss]).all()
#                 for obj in objs:
#                     key = obj.__class__.__name__ + '.' + obj.id
#                     new_dict[key] = obj
#         return (new_dict)

#     def new(self, obj):
#         self.__session.add(obj)

#     def save(self):
#         try:
#             self.__session.commit()  # Commit the transaction
#         except Exception as e:
#             self.__session.rollback()  # Roll back the transaction in case of an error
#             raise e

#     def rollback(self):
#         try:
#             self.__session.rollback()
#         except Exception as e:
#             # Log the error
#             logging.error(f"Error during database rollback: {e}")

#     def delete(self, obj=None):
#         if obj is not None:
#             self.__session.delete(obj)

#     def reload(self):
#         Base.metadata.create_all(self.__engine)
#         session_factory = sessionmaker(bind=self.__engine,
#                                        expire_on_commit=False)
#         Session = scoped_session(session_factory)
#         self.__session = Session()

#     def close(self):
#         """call remove() method on the private session attribute"""
#         self.__session.close()

#     def get(self, cls, id):
#         """
#         Returns the object based on the class name and its ID, or
#         None if not found
#         """
#         if cls not in classes.values():
#             return None

#         all_cls = models.storage.all(cls)
#         for value in all_cls.values():
#             if (value.id == id):
#                 return value

#         return None

#     def count(self, cls=None):
#         """
#         count the number of objects in storage
#         """
#         all_class = classes.values()

#         if not cls:
#             count = 0
#             for clas in all_class:
#                 count += len(models.storage.all(clas).values())
#         else:
#             count = len(models.storage.all(cls).values())

#         return count

#!/usr/bin/python3
"""Database storage engine"""
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import logging
from models.base_model import Base  # import your BaseModel here
# Import your model classes here
from models.hospital_db import Hospital
from models.patient_info import Patient
from models.health_info import PatientHealthInfo

classes = {"Hospital": Hospital, "Patient": Patient,
           "PatientHealthInfo": PatientHealthInfo}


class DBStorage:
    __engine = None
    __session = None

    def __init__(self):
        # Configure your database URI here
        self.__engine = create_engine(
            'mysql+mysqldb://admin_dev:Pwd.admin1dev@localhost/patient_dev_db',
            pool_pre_ping=True)

    def all(self, cls=None):
        """Query on the current database session."""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return new_dict

    def new(self, obj):
        """Add the object to the current database session."""
        self.__session.add(obj)

    def save(self):
        """Commit all changes of the current database session."""
        try:
            self.__session.commit()
        except Exception as e:
            self.__session.rollback()  # Roll back the transaction in case of an error
            raise e

    def rollback(self):
        """Roll back the current transaction."""
        try:
            self.__session.rollback()
        except Exception as e:
            logging.error(f"Error during database rollback: {e}")

    def delete(self, obj=None):
        """Delete obj from the current database session if it's not None."""
        if obj is not None:
            self.__session.delete(obj)

    # def reload(self):
    #     """Create all tables in the database and initialize a new session."""
    #     Base.metadata.create_all(self.__engine)
    #     session_factory = sessionmaker(
    #         bind=self.__engine, expire_on_commit=False)
    #     Session = scoped_session(session_factory)
    #     self.__session = Session()

    def reload(self):
        try:
            Base.metadata.create_all(self.__engine)
            session_factory = sessionmaker(
                bind=self.__engine, expire_on_commit=False)
            Session = scoped_session(session_factory)
            self.__session = Session()
        except Exception as e:
            logging.error(f"Error during session reload: {e}")
        # No finally block needed here as we're setting up the session

    def close(self):
        """Call remove() method on the private session attribute."""
        self.__session.close()

    def get(self, cls, id):
        """Return the object based on the class name and its ID, or None if not found."""
        if cls not in classes.values():
            return None

        all_cls = self.all(cls)
        for value in all_cls.values():
            if value.id == id:
                return value
        return None

    def count(self, cls=None):
        """Count the number of objects in storage."""
        if not cls:
            count = 0
            for clas in classes.values():
                count += len(self.all(clas).values())
        else:
            count = len(self.all(cls).values())

        return count

# Add additional methods if needed
