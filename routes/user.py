from fastapi import APIRouter
from fastapi import HTTPException
from config.db import conn
from schemas.user import *
from models.user import Usuario,Prestamo,Libro,Copia,Edicion,Autor,Autorear
from bson import ObjectId
import unicodedata
import re
import json
#define rutas
lib = APIRouter()

def normalize(text):
    # Remover caracteres diacríticos
    normalized = unicodedata.normalize('NFD', text)
    return ''.join([c for c in normalized if unicodedata.category(c) != 'Mn'])





pipeline = [
    {
        "$lookup": {
            "from": "edicion",
            "localField": "isbn",
            "foreignField": "isbn",
            "as": "edicion_info"
        }
    },
     {
        "$unwind": "$edicion_info"
    },
    {
        "$lookup": {
            "from": "copia",
            "localField": "isbn",
            "foreignField": "isbn",
            "as": "copia_info"
        }
    },
    {
        "$unwind": "$copia_info"
    },{
        "$lookup": {
            "from": "autorear",
            "localField": "titulo",
            "foreignField": "titulo",
            "as": "autorear_info"
        }
    },
    {
        "$unwind": "$autorear_info"
    },
     {
        "$lookup": {
            "from": "autor",
            "localField": "autorear_info.nombre",
            "foreignField": "nombre",
            "as": "autor_info"
        }
    },
    {
        "$unwind": "$autor_info"
    },
    {
        "$project": {
            "_id": 0,
            "isbn": "$isbn",
            "numero": "$copia_info.numero",
            "titulo": "$titulo",
            "anyo": "$edicion_info.anyo",
            "idioma": "$edicion_info.idioma",
            "autor": "$autor_info.nombre"
        }
    }

]



#conn.[database].[collectionName]
# QUERY 
@lib.get('/query1')
def show_bookcopies():
    res =[doc for doc in conn.biblioteca.libro.aggregate(pipeline)]
    print(res)
    return query1Entities(res)

@lib.get('/query2/{nombre}')
def query2(nombre:str):
    pipeline2 = [
        {
            "$lookup": {
                "from": "usuario",
                "localField": "rut",
                "foreignField": "rut",
                "as": "usuario_info"  
            }
        },
        {
            "$unwind": "$usuario_info"
        },
        {
            "$match": {
                "usuario_info.nombre": nombre
            }
        },
        {
            "$lookup": {
                "from": "libro",
                "localField": "isbn",
                "foreignField": "isbn",
                "as": "libro_info"
            }
        },
        {
            "$unwind": "$libro_info"
        },
        {
            "$group": {
                "_id": {
                    "libro": "$libro_info.titulo",
                    "usuario": "$usuario_info.nombre"
                },
                "count": {"$sum": 1}  # Puedes contar cuántas veces está prestado el mismo libro
            }
        },
        {
            "$project": {
                "_id": 0,
                "libro": "$_id.libro",
                "usuario": "$_id.usuario",
                "prestamos": "$count"
            }
        }
    ]
    res = [doc for doc in conn.biblioteca.prestamo.aggregate(pipeline2)]
    print(res)
    return query2Entities(res)


#GETs Encontrar
@lib.get('/users',tags=["Usuarios"])
def find_all_users():
    return usuariosEntity(conn.biblioteca.usuario.find())

@lib.get('/users/{rut}',tags=["Usuarios"])
def find_user(rut:str):
     return usuarioEntity(conn.biblioteca.usuario.find_one(
         {"rut": rut})
         )

@lib.get('/books',tags=["Libros"])
def find_all_books():
    return librosEntity(conn.biblioteca.libro.find())

@lib.get('/books/{titulo}',tags=["Libros"])
def find_book(titulo:str):
     return libroEntity(conn.biblioteca.libro.find_one(
         {"titulo": titulo})
         )

@lib.get('/authors',tags=["Autores"])
def find_all_authors():
    return autoresEntity(conn.biblioteca.autor.find())

@lib.get('/authors/{nombre}', tags=["Autores"])
def find_authors(nombre: str):
    nombre = normalize(nombre)  # Normaliza el nombre ingresado
    regex = re.compile(f'.*{re.escape(nombre)}.*', re.IGNORECASE)  # Busca coincidencias en cualquier parte del nombre
    authors = list(conn.biblioteca.autor.find({"nombre_normalizado": regex}))
    if authors:
        return [autorEntity(author) for author in authors]
    else:
        raise HTTPException(status_code=404, detail="No authors found matching the criteria")


@lib.get('/editions',tags=["Ediciones"])
def find_all_editions():
    return edicionesEntity(conn.biblioteca.edicion.find())

@lib.get('/editions/{isbn}',tags=["Ediciones"])
def find_edition(isbn:str):
     return edicionEntity(conn.biblioteca.edicion.find_one(
         {"isbn": isbn})
         )

@lib.get('/copies',tags=["Copias"])
def find_all_copies():
    return copiasEntity(conn.biblioteca.copia.find())

@lib.get('/copies/{isbn}/{num}',tags=["Copias"])
def find_copy(isbn:str,numero:int):
     return copiaEntity(conn.biblioteca.copia.find_one(
         {"isbn": isbn,"numero":numero})
         )

@lib.get('/loans',tags=["Prestamos"])
def find_all_loans():
    return prestamosEntity(conn.biblioteca.prestamo.find())

@lib.get('/loans/{isbn}/{num}/{rut}',tags=["Prestamos"])
def find_loan(isbn:str,numero:int,rut:str):
     return prestamoEntity(conn.biblioteca.prestamo.find_one(
         {"isbn": isbn,"numero":numero,"rut":rut})
         )
@lib.get('/autorear',tags=["Autorear"])
def find_all_autorear():
    return autorearEntities(conn.biblioteca.autorear.find())

@lib.get('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def find_autorear(titulo:str,nombre:str):
    return autorearEntity(conn.biblioteca.autorear.find_one(
        {"titulo":titulo,"nombre":nombre}
    ))

#POSTs Insertar

@lib.post('/users',tags=["Usuarios"])
def create_user(usuario:Usuario):
    new_user = dict(usuario)
    conn.biblioteca.usuario.insert_one(new_user)
    creado = conn.biblioteca.usuario.find_one({"rut":new_user["rut"]})
    return usuarioEntity(creado)

@lib.post('/authors',tags=["Autores"])
def create_autor(autor:Autor):
    new = dict(autor)
    conn.biblioteca.autor.insert_one(new)
    creado = conn.biblioteca.autor.find_one({"nombre":new["nombre"]})
    return autorEntity(creado)

@lib.post('/books',tags=["Libros"])
def create_book(libro:Libro):
    new = dict(libro)
    conn.biblioteca.libro.insert_one(new)
    creado = conn.biblioteca.libro.find_one({"titulo":new["titulo"]})
    return libroEntity(creado)

@lib.post('/editions',tags=["Ediciones"])
def create_edition(edicion:Edicion):
    new = dict(edicion)
    conn.biblioteca.edicion.insert_one(new)
    creado = conn.biblioteca.edicion.find_one({"isbn":new["isbn"]})
    return edicionEntity(creado)

@lib.post('/copies',tags=["Copias"])
def create_copy(copia:Copia):
    new = dict(copia)
    conn.biblioteca.copia.insert_one(new)
    creado = conn.biblioteca.copia.find_one({"isbn": new["isbn"],"numero":new["numero"]})
    return copiaEntity(creado)

@lib.post('/loans',tags=["Prestamos"])
def create_loan(prestamo:Prestamo):
    new = dict(prestamo)
    conn.biblioteca.prestamo.insert_one(new)
    creado = conn.biblioteca.prestamo.find_one({"isbn": new["isbn"],"numero":new["numero"],"rut":new["rut"]})
    return prestamoEntity(creado)

@lib.post('/autorear',tags=["Autorear"])
def create_autorear(autorear:Autorear):
    new = dict(autorear)
    conn.biblioteca.autorear.insert_one(new)
    creado = conn.biblioteca.autorear.find_one({"titulo":new["titulo"],"nombre":new["nombre"]})
    return autorearEntity(creado)

#PUTs Actualizar
@lib.put('/users/{rut}',tags=["Usuarios"])
def update_user(rut:str,usuario:Usuario):
    
    fixloan(rut,usuario.rut)
    conn.biblioteca.usuario.find_one_and_update({
        "rut":rut
    },  {"$set": dict(usuario)}
    )
    return  usuarioEntity(conn.biblioteca.usuario.find_one({"rut":usuario.rut}))

@lib.put('/authors/{nombre}',tags=["Autores"])
def update_author(nombre:str,autor:Autor):
    fixauthor(nombre,autor.nombre)
    conn.biblioteca.autor.find_one_and_update({
        "nombre":nombre
    },  {"$set": dict(autor)}
    )
    return  autorEntity(conn.biblioteca.autor.find_one({"nombre":autor.nombre}))

@lib.put('/books/{titulo}',tags=["Libros"])
def update_book(titulo:str,libro:Libro):
    fixbook(titulo,libro.titulo)
    conn.biblioteca.libro.find_one_and_update({
        "titulo":titulo
    },  {"$set": dict(libro)}
    )
    return  libroEntity(conn.biblioteca.libro.find_one({"titulo":libro.titulo}))

@lib.put('/editions/{isbn}',tags=["Ediciones"])
def update_edition(isbn:str,edicion:Edicion):
    fixbook_edicion(isbn,edicion.isbn)
    fixcopy_edicion(isbn,edicion.isbn)
    fixloan_edicion(isbn,edicion.isbn)
    conn.biblioteca.edicion.find_one_and_update({
        "isbn":isbn
    },  {"$set": dict(edicion)}
    )
    return  edicionEntity(conn.biblioteca.edicion.find_one({"isbn":edicion.isbn}))

@lib.put('/copies/{isbn}/{numero}',tags=["Copias"])
def update_copy(isbn:str,numero:int,copia:Copia):
    fixloan_copia(numero,isbn,copia.numero,copia.isbn)
    conn.biblioteca.copia.find_one_and_update({
        "isbn":isbn,
        "numero":numero
    },  {"$set": dict(copia)}
    )
    return  copiaEntity(conn.biblioteca.copia.find_one({"isbn":copia.isbn,"numero":copia.numero}))

@lib.put('/copies/{isbn}/{numero}/{rut}',tags=["Prestamos"])
def update_loan(isbn:str,numero:int,rut:str,prestamo:Prestamo):
    conn.biblioteca.prestamo.find_one_and_update({
        "isbn":isbn,
        "numero":numero,
        "rut":rut
    },  {"$set": dict(prestamo)}
    )
    return  prestamoEntity(conn.biblioteca.prestamo.find_one(
        {"isbn":prestamo.isbn,"numero":prestamo.numero,"rut":prestamo.rut}))

@lib.put('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def update_autorear(titulo:str,nombre:str,autorear:Autorear):
    conn.biblioteca.autorear.find_one_and_update({
        "titulo":titulo,
        "nombre":nombre
    },  {"$set": dict(autorear)})
    return autorearEntity(conn.biblioteca.autorear.find_one({"titulo":autorear.titulo,"nombre":autorear.nombre}))
#DELETEs Borrar
@lib.delete('/users/{rut}',tags=["Usuarios"])
def delete_user(rut:str):
    delfix_user(rut)
    conn.biblioteca.usuario.delete_one({"rut":rut})
    return f"deleted {rut}"

@lib.delete('/authors/{nombre}', tags=["Autores"])
def delete_author(nombre: str):
    # Intentar buscar el autor antes de borrar para verificar si existe
    author = conn.biblioteca.autor.find_one({"nombre": nombre})
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    result = conn.biblioteca.autor.delete_one({"nombre": nombre})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Author not found after deletion attempt")

    return {"detail": f"Author '{nombre}' deleted successfully"}

@lib.delete('/books/{titulo}',tags=["Libros"])
def delete_book(titulo:str):
    delfix_book(titulo)
    conn.biblioteca.libro.delete_one({"titulo":titulo})
    return f"deleted {titulo}"

@lib.delete('/editions/{isbn}',tags=["Ediciones"])
def delete_edition(isbn:str):
    delfixbook_edicion(isbn)
    delfixcopy_edicion(isbn)
    delfixloan_edicion(isbn)
    conn.biblioteca.edicion.delete_one({"isbn":isbn})
    return f"deleted {isbn}"

@lib.delete('/copies/{isbn}/{num}',tags=["Copias"])
def delete_copy(isbn:str,numero:int):
    delfixloan_copia(numero,isbn)
    conn.biblioteca.copia.delete_one({"isbn":isbn,"numero":numero})
    return f"deleted {isbn}/{numero}"

@lib.delete('/loans/{isbn}/{num}/{rut}',tags=["Prestamos"])
def delete_copy(isbn:str,numero:int,rut:str):
    conn.biblioteca.prestamo.delete_one({"isbn":isbn,"numero":numero,"rut":rut})
    return f"deleted {isbn}/{numero}/{rut}"

@lib.delete('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def delete_autorear(titulo:str,nombre:str):
    conn.biblioteca.autorear.delete_one({"titulo":titulo,"nombre":nombre})
    return f"deleted {titulo}/{nombre}"

#Fixes
@lib.put('/loans',tags=["Prestamos"]) # ante cambio en copia, cambio en prestamo
def fixloan_copia(numero:int,isbn:str,new_num:int,new_isbn:str):
    conn.biblioteca.prestamo.update_many({
        "numero":numero,"isbn":isbn
    },  {"$set": {"numero":new_num,"isbn":new_isbn}}
    )

@lib.delete('/loans',tags=["Prestamos"])
def delfixloan_copia(numero:int,isbn:str): # copia borrada, borrada en prestamo
    conn.biblioteca.prestamo.delete_many({"numero":numero,"isbn":isbn})


@lib.put('/loans',tags=["Prestamos"])
def fixloan(rut:str,new_rut:str): # usuario cambiado, cambia en prestamo
    conn.biblioteca.prestamo.update_many({
        "rut":rut
    },  {"$set": {"rut":new_rut}}
    )

@lib.delete('/loans',tags=["Prestamos"])
def delfix_user(rut:str): # usuario borrado, borrado en prestamo
    conn.biblioteca.prestamo.delete_many({"rut":rut})

@lib.put('/autorear',tags=["Autorear"]) # cambio en autor cambio en autorear
def fixauthor(nombre:str,new_nombre:str):
    conn.biblioteca.autorear.update_many({
        "nombre":nombre
    },  {"$set": {"nombre":new_nombre}}
    )

@lib.put('/autorear',tags=["Autorear"])
def fixbook(titulo:str,new_titulo:str):
    conn.biblioteca.autorear.update_many({
        "titulo":titulo
    },  {"$set": {"titulo":new_titulo}}
    ) 

@lib.delete('/autorear',tags=["Autorear"])
def delfix_book(titulo:str):
    conn.biblioteca.autorear.delete_many({"titulo":titulo})

@lib.delete('/autorear',tags=["Autorear"])
def delfix_author(nombre:str):
    conn.biblioteca.autorear.delete_many({"nombre":nombre})

@lib.put('/books',tags=["Libros"]) # ante cambio en edicion,cambio en libro
def fixbook_edicion(isbn:str,new_isbn:str):
    conn.biblioteca.libro.update_many({"isbn":isbn}, {"$set": {"isbn":new_isbn}})

@lib.put('/copies',tags=["Copias"]) # ante cambio en edicion, cambio en copia
def fixcopy_edicion(isbn:str,new_isbn:str):
    conn.biblioteca.copia.update_many({"isbn":isbn},{"$set": {"isbn":new_isbn}})
                                     
@lib.put('/loans',tags=["Prestamos"]) # ante cambio en edicion, cambio en prestamos
def fixloan_edicion(isbn:str,new_isbn:str):
    conn.biblioteca.prestamo.update_many({"isbn":isbn},{"$set": {"isbn":new_isbn}})

@lib.delete('/books',tags=["Libros"]) # ante borrado en edicion, cambio en libro
def delfixbook_edicion(isbn:str):
    conn.biblioteca.libro.delete_many({"isbn":isbn})

@lib.delete('/copies',tags=["Copias"]) # ante  borrado en edicion, cambio en copia
def delfixcopy_edicion(isbn:str): 
    conn.biblioteca.copia.delete_many({"isbn":isbn})

@lib.delete('/loans',tags=["Prestamos"]) # ante  borrado en edicion, cambio en prestamo
def delfixloan_edicion(isbn:str):
    conn.biblioteca.prestamo.delete_many({"isbn":isbn})

@lib.post('/seed')
def fill_db():
    conn.biblioteca.autor.insert_many([{"nombre": "Gabriel García Márquez"},
                                      {"nombre": "J.K. Rowling"},{"nombre": "George R.R. Martin"},
                                      {"nombre": "Isabel Allende"},{"nombre": "Paulo Coelho"}]) 
    conn.biblioteca.autor.insert_many([{"nombre": "Gabriel García Márquez"},
                                      {"nombre": "J.K. Rowling"},{"nombre": "George R.R. Martin"},
                                      {"nombre": "Isabel Allende"},{"nombre": "Paulo Coelho"}]) 
    conn.biblioteca.libro.insert_many([{"titulo": "Cien años de soledad", "isbn": "978-84-376-0494-7"},
                    {"titulo": "Harry Potter y la piedra filosofal", "isbn": "978-84-9838-631-9"},
                    {"titulo":"Juego de tronos", "isbn": "978-84-450-0262-9"},
                    {"titulo": "La casa de los espíritus", "isbn": "978-84-663-2716-3"},
                    {"titulo": "El alquimista", "isbn": "978-84-08-00279-5"}]) 
    
    conn.biblioteca.autorear.insert_many([
    {"titulo": "Cien años de soledad", "nombre": "Gabriel García Márquez"},
    {"titulo": "Harry Potter y la piedra filosofal", "nombre": "J.K. Rowling"},
    {"titulo": "Juego de tronos", "nombre": "George R.R. Martin"},
    {"titulo": "La casa de los espíritus", "nombre": "Isabel Allende"},
    {"titulo": "El alquimista", "nombre": "Paulo Coelho"}])
    conn.biblioteca.edicion.insert_many([
    {"isbn": "978-84-376-0494-7", "anyo": "1967", "idioma": "Español"},
    {"isbn": "978-84-9838-631-9", "anyo": "1997", "idioma": "Inglés"},
    {"isbn": "978-84-450-0262-9", "anyo": "1996", "idioma": "Inglés"},
    {"isbn": "978-84-663-2716-3", "anyo": "1982", "idioma": "Español"},
    {"isbn": "978-84-08-00279-5", "anyo": "1988", "idioma": "Portugués"}])

    
    isbns = [
    "978-84-376-0494-7", "978-84-9838-631-9", "978-84-450-0262-9", "978-84-663-2716-3", 
    "978-84-08-00279-5"]

    # Para cada ISBN
    for isbn in isbns:
        # Inserta 5 registros
        copias = [{"numero": j, "isbn": isbn} for j in range(1, 6)]
        conn.biblioteca.copia.insert_many(copias)

    # Lista de nombres generados
    nombres = ["Carlos", "María", "Pedro", "Ana", "Javier", "Carmen", "Miguel", "Teresa", "Francisco", "Isabel", "Antonio", "Pilar", "José", "Laura", "Juan", "Sara", "Manuel", "Elena", "Luis", "Patricia"]

    # Para cada nombre en la lista
    for i, nombre in enumerate(nombres):
        # Genera un RUT aleatorio de 6 dígitos
        rut = str(100000 + i * 3000)
        
        # Inserta el usuario en la colección
        conn.biblioteca.usuario.insert_one({"rut": rut, "nombre": nombre})

    conn.biblioteca.prestamo.insert_many([{"numero":2 , "isbn":"978-84-376-0494-7", 
                                     "rut": "100000", 
                                     "fecha_pres": "04/03/2024", 
                                     "fecha_dev": "18/03/2024"},{"numero":3 , "isbn":"978-84-663-2716-3", 
                                     "rut": "100000", 
                                     "fecha_pres": "04/03/2024", 
                                     "fecha_dev": "18/03/2024"},{"numero":1 , "isbn":"978-84-9838-631-9", 
                                     "rut": "109000", 
                                     "fecha_pres": "01/02/2024", 
                                     "fecha_dev": "15/02/2024"}])
    # carlos presta numero 2 de 100 años de soledad DD/MM/AAAA, tambien casa de espiritus
    # Ana presta numero 1 Harry Potter
    
for author in conn.biblioteca.autor.find():
    normalized_name = normalize(author['nombre'])
    conn.biblioteca.autor.update_one(
        {'_id': author['_id']},
        {'$set': {'nombre_normalizado': normalized_name}}
    )
