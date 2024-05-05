
#Devolver un documento
def usuarioEntity(item) -> dict:
    return {
        "rut":item["rut"],
        "nombre":item["nombre"]
    }

def autorEntity(item)-> dict:
    return {
        "nombre":item["nombre"]
    }

def libroEntity(item)-> dict:
    return {
        "titulo":item["titulo"],
        "isbn":item["isbn"]
    }

#Devolver collection
def usuariosEntity(entity)->list:
    return [usuarioEntity(item) for item in entity]

def autoresEntity(entity)->list:
    return [autorEntity(item) for item in entity]

def librosEntity(entity)->list:
    return [libroEntity(item) for item in entity]