import mongoengine


def connect_to_mongo(db, host):
    mongoengine.disconnect()

    mongoengine.connect(
        db=db,
        host=host,
        uuidRepresentation="standard"
    )