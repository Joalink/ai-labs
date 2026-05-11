import shutil

from app.services.docs_assistant.ingestion import ingest_pdf
from fastapi import APIRouter, UploadFile

router = APIRouter()


@router.post("/documents", status_code=201)
async def documents(file: UploadFile):

    try:
        path = f"data/{file.filename}"

        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ingest_pdf(path)

        return {"message": "File uploaded"}
    except Exception as e:
        print(e)
        return {"error": str(e)}
