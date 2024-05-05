from fastapi import APIRouter
from config.db import conn
from schemas.user import usuarioEntity,usuariosEntity,autorEntity,autoresEntity
from models.user import User,Usuario,Prestamo,Libro,Copia,Edicion,Autor,Autorear
from bson import ObjectId

# define rutas
lib = APIRouter()

#conn.[database].[collectionName]

#GETs Encontrar
@lib.get('/users')
def find_all_users():
    return usuariosEntity(conn.biblioteca.usuario.find())

@lib.get('/users/{id}')
def find_user(rut:str):
     return usuarioEntity(conn.biblioteca.usuario.find_one(
         {"rut": rut})
         )

@lib.get('/authors')
def find_all_authors(nombre):
    return usuariosEntity(conn.biblioteca.usuario.find())

@lib.get('/authors/{id}')
def find_author(rut:str):
     return autorEntity(conn.biblioteca.usuario.find_one(
         {"rut": rut})
         )


#POSTs Insertar

@lib.post('/users')
def create_user(usuario:Usuario):
    new_user = dict(usuario)
    conn.biblioteca.usuario.insert_one(new_user)
    creado = conn.biblioteca.usuario.find_one({"rut":new_user["rut"]})
    return usuarioEntity(creado)

@lib.post('/users')
def create_autor(autor:Autor):
    new = dict(autor)
    conn.biblioteca.autor.insert_one(new)
    creado = conn.biblioteca.autor.find_one({"rut":new["rut"]})
    return usuarioEntity(creado)


#PUTs Actualizar

#DELETEs Borrar
@lib.delete('/users/{rut}')
def delete_user(rut:str):
    conn.biblioteca.usuario.delete_one({"rut":rut})
    return f"deleted {rut}"



""" #update
@user.put('/users({id})')
def update_user(id:str,user:User):
    conn.local.user.find_one_and_update({
        "_id": ObjectId(id)
    },  {"$set": dict(user)}
    )
    return  userEntity(conn.local.user.find_one({"_id": ObjectId(id)}))


#delete
@user.delete('/users({id})')
def delete_user(id:str):
    conn.local.user.delete_one({"_id":ObjectId(id)})
    return f"deleted {id}"
 """
