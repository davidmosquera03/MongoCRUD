from typing import Optional
from pydantic import BaseModel

#Incluye los modelos de cada collección
""" class User(BaseModel):
    id:Optional[str]=None
    name:str
    email:str
    password:str """

class Usuario(BaseModel):
    rut:str
    nombre:str

class Prestamo(BaseModel):
    numero: int
    isbn: str
    rut: str
    fecha_dev: str
    fecha_pres:str

class Copia(BaseModel):
    numero: int
    isbn: str

class Edicion(BaseModel):
    isbn: str
    anyo: int
    idioma: str
    
class Libro(BaseModel):
    titulo:str
    isbn:str

class Autorear(BaseModel):
     titulo:str
     nombre:str
    
class Autor(BaseModel):
    nombre:str
    